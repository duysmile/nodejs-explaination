# Handle race condition by Redis Set

`Problem`: Trường hợp cần giới hạn số lần chạy 1 action khi có nhiều API được gọi đồng thời cùng lúc.
`Expectation`: Action đó chỉ được gọi 1 lần trong 1 khoảng thời gian cố định.
`Solution`:
    - Sử dụng Redis Set, mỗi lần gọi API thì thêm 1 unique action vào Set
    - Nếu thêm vào thành công, nghĩa là đồng thời không có process nào khác đang gọi action đó, và chúng ta có thể chạy nó bình thường.
    - Nếu kết quả là không thêm vào được thì nghĩa là có 1 process đang chạy action đó, khi đó chúng ta có thể bỏ qua hoặc quyết định đợi action đó chạy xong.
