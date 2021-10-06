### Aggregate vs Login handling with Mongo Query

**Chạy test với k6**

Giả lập đây là một tác vụ thống kê, chúng ta sẽ chạy 10 virtual users đồng thời và tổng cộng 100 requests.

1. Aggregate

|#|Scenario|Time|RPS|p95|Mongo CPU| Node CPU|
|-|--------|----|---|---|---------|---------|
|1|aggregate.js|43s|2.3|4.8s|600%|1%|

2. Logic

|#|Scenario|Time|RPS|p95|Mongo CPU| Node CPU|
|-|--------|----|---|---|---------|---------|
|2|logic.js|3m22s|0.49|23.41s|123%|140%|

#### Conclusion
- Với kết quả trên chúng ta có thể thấy rằng `aggregate` nhanh hơn hẳn việc sử dụng logic ở tầng application để thống kê, nguyên nhân là gi:
    - Mọi xử lí đều ở DB, và DB thì xử lí rất nhanh với dữ liệu đã được sắp xếp hợp lí.
    - Loại bỏ gần như 100% network roundtrip so với việc chạy `logic`, vì chỉ tốn 1 query cho 1 request và lượng data transfer qua network cũng rất ít (chỉ chứa kết quả của query), còn logic phải load tất cả data về application để xử lí, và số lần query DB cũng nhiều hơn dựa trên số lượng data.

- Và chúng ta cũng thấy được cái giá phải trả để đạt được tốc độ của aggregate:
    - CPU của Mongo bị peak lên rất cao `800%`, nếu chạy trong môi trường auto scale hoặc share DB thì chắc chắn sẽ làm hệ thống bị gián đoạn, hoặc tệ hơn có thể crash của hệ thống. Trong khi đó server của chúng ta gần như không cần phải làm gì.
    - Với cách chạy bằng `logic` thì thời gian chận hơn tới hơn 2 lần, nhưng lượng resource phải sử dụng sẽ được share đều cho cả App và DB, tải lên DB cũng được chia đều ra và chỉ ở mức (123%), tức là giảm tới gần 8 lần, đồng thời thì CPU của App cũng tăng lên 100%.

- Như vậy chúng ta có thể thấy rằng, nếu DB của chúng ta được tách riêng cho việc analysis và application thì nên sử dụng aggregate để tận dụng tối đa sức mạnh của DB, đồng thời hệ thống analysis phải hoàn toàn độc lập vs application để những thời điểm peak CPU không ảnh hưởng tới người dùng. Còn nếu trong trường hợp DB được dùng chung, cũng như việc user sử dụng chức năng analysis như một phần của application thì nên sử dụng logic để có thể kiểm soát workload lên DB cũng như tận dụng tối đa application (service cho analysis, report).