# MongoDB

### Concurrency

- Ref: https://docs.mongodb.com/manual/faq/concurrency/

- MongoDB cho phép clients đọc và ghi cùng data. Để đảm bảo consistency, MongoDB sử dụng locking và `concurrency control` để tránh clients thay đổi cùng một data đồng thời.

- Việc write vào 1 single data thì hoặc là lưu đc tất cả hai là không thay đổi gì cả.

`locks`: Mongo dùng lock để đảm bảo concurrency không làm cho dữ liệu bị sai. Mongo dùng 3 loại lock là `read lock`, `write lock` và `intent lock`.

`read lock`: Là một shared lock trên 1 resource trên collection hoặc database, mà khi đang giữ lock này thì cho phép concurrent readers nhưng không cho phép writers.

`write lock`: Cùng là lock trên 1 resource của collection hoặc database. Khi write một resource, thì nó sẽ có 1 exclusive lock để không có process nào khác có thể write hoặc read trên resource đó.

`intent lock`: Intent lock cho phép concurrent readers và writers trên 1 resource. Một lock trên 1 resource chỉ ra rằng process đang nắm giữ lock đó sẽ read hoặc write resource đó sử dụng concurrency control ở mức độ chi tiết hơn là `intent lock`.

<details>
    <summary>
        <b>1. Mongo đang dùng những loại lock nào?</b>
    </summary>

- Mongo dùng nhiều loại lock để lock ở nhiều tầng, từ global, database, collection, và cho phép storage engine implement concurrency control của nó dưới tấng collection (vd như document level ở Wired Tiger).

- Mongo sử dụng reader-writer locks cho phép nhiều readers đồng thời truy cập vào 1 tài nguyên, như database hay collection.

- Mongo dùng những kiểu lock này cho read/write:
    - Shared (S) locking mode cho reads operations
    - Exclusive (E) locking mode cho write operations
    - Intent shared (IS) và Intent Exclusive (IE) modes cho biết ý định read hoặc write 1 resource bằng cách sử dụng những loại lock chi tiết hơn.

- Ví dụ:
    - Khi lock một collection để write (dùng mode X), cả database tương ứng và global sẽ bị lock ở intent exclusive mode (IX).
    - Một database có thể đồng thời bị lock ở IS mode và IX mode, nhưng một exclusive (X) lock không thể cùng tồn tại với bất kì mode nào khác, và một shared (S) lock chỉ có thể cùng tồn tại với intent shared (IS) locks.

- Lock requests cho read và write sẽ được queue theo thứ tự.
- Tuy nhiên để tối ưu throughput thì khi 1 lock request được cấp, thì tất cả những lock tương thích khác cũng sẽ được cấp, có khả năng release lock trước thực hiện một lock request bị conflict.
- Ví dụ:
    - Xem xét một trường hợp khi mà `X` lock vừa được released, và conflict queue chứa những lock sau:
    ```
    IS -> IS -> X -> X -> S -> IS
    ```
    - Theo thứ tự FIFO, chỉ có 2 IS mode đầu được cấp. Nhưng thay vào đó, Mongo sẽ cấp tất cả IS và S modes, và khi mà tất cả xong thì khi đó nó mới cấp X, ngay cả khi IS và S request được đưa vào queue trong thời gian đó. Và nó sẽ luôn move tất cả request lên phía trước của queue nên sẽ không có request nào bị bỏ lại.
</details>
