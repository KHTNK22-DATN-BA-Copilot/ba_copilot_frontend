# Báo Cáo Kiểm Thử - Chức Năng Quên Mật Khẩu

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Quên mật khẩu  
**Phiên bản**: 2.0  
**Tổng số test case**: 15

---

## Mục lục

1. [TC-FP-001: Gửi yêu cầu đặt lại mật khẩu thành công](#tc-fp-001)
2. [TC-FP-002: Gửi yêu cầu với email không tồn tại](#tc-fp-002)
3. [TC-FP-003: Gửi yêu cầu với email sai định dạng](#tc-fp-003)
4. [TC-FP-004: Gửi yêu cầu khi để trống email](#tc-fp-004)
5. [TC-FP-005: Xác thực OTP đúng](#tc-fp-005)
6. [TC-FP-006: Xác thực OTP sai](#tc-fp-006)
7. [TC-FP-007: Xác thực OTP đã hết hạn](#tc-fp-007)
8. [TC-FP-008: Đặt mật khẩu mới thành công](#tc-fp-008)
9. [TC-FP-009: Đặt mật khẩu mới không khớp xác nhận](#tc-fp-009)
10. [TC-FP-010: Đặt mật khẩu mới quá yếu](#tc-fp-010)
11. [TC-FP-011: Hoàn thành toàn bộ flow 4 bước](#tc-fp-011)
12. [TC-FP-012: Gửi lại OTP](#tc-fp-012)
13. [TC-FP-013: Quay lại bước trước trong flow](#tc-fp-013)
14. [TC-FP-014: Nhấn liên kết quay lại trang đăng nhập](#tc-fp-014)
15. [TC-FP-015: Nhập OTP không đủ số ký tự](#tc-fp-015)

---

### TC-FP-001: Gửi yêu cầu đặt lại mật khẩu thành công {#tc-fp-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi email đặt lại mật khẩu với email hợp lệ đã đăng ký |
| **Điều kiện tiên quyết** | - Tài khoản `user@example.com` đã tồn tại và đã xác thực<br>- Người dùng đang ở trang quên mật khẩu (`/forgot-password`) — Bước 1: Nhập email |
| **Các bước thực hiện** | 1. Nhập email đã đăng ký vào trường "Email"<br>2. Nhấn nút "Gửi mã xác nhận" |
| **Dữ liệu test** | Email: `user@example.com` |
| **Kết quả mong đợi** | - Hệ thống gửi email chứa mã OTP 6 chữ số<br>- OTP có thời hạn 15 phút<br>- Chuyển sang Bước 2: Nhập OTP<br>- Hiển thị thông báo "Mã xác nhận đã được gửi đến email của bạn" |

---

### TC-FP-002: Gửi yêu cầu với email không tồn tại {#tc-fp-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi yêu cầu đặt lại mật khẩu với email chưa đăng ký |
| **Điều kiện tiên quyết** | - Email `notexist@example.com` chưa đăng ký trong hệ thống<br>- Người dùng đang ở trang quên mật khẩu — Bước 1 |
| **Các bước thực hiện** | 1. Nhập email chưa đăng ký vào trường "Email"<br>2. Nhấn nút "Gửi mã xác nhận" |
| **Dữ liệu test** | Email: `notexist@example.com` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email không tồn tại trong hệ thống"<br>- Không gửi email<br>- Người dùng vẫn ở Bước 1 |

---

### TC-FP-003: Gửi yêu cầu với email sai định dạng {#tc-fp-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi yêu cầu đặt lại mật khẩu với email không đúng format |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang quên mật khẩu — Bước 1 |
| **Các bước thực hiện** | 1. Nhập email sai định dạng vào trường "Email"<br>2. Nhấn nút "Gửi mã xác nhận" |
| **Dữ liệu test** | Email: `invalidemail` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email không đúng định dạng"<br>- Không gửi request đến server<br>- Người dùng vẫn ở Bước 1 |

---

### TC-FP-004: Gửi yêu cầu khi để trống email {#tc-fp-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi yêu cầu đặt lại mật khẩu khi không nhập email |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang quên mật khẩu — Bước 1 |
| **Các bước thực hiện** | 1. Để trống trường "Email"<br>2. Nhấn nút "Gửi mã xác nhận" |
| **Dữ liệu test** | Email: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email là bắt buộc"<br>- Nút gửi có thể bị vô hiệu hóa |

---

### TC-FP-005: Xác thực OTP đúng {#tc-fp-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhập mã OTP đúng để xác thực |
| **Điều kiện tiên quyết** | - Đã gửi yêu cầu đặt lại mật khẩu thành công (Bước 1 hoàn thành)<br>- Mã OTP còn hạn (trong 15 phút)<br>- Người dùng đang ở Bước 2: Nhập OTP |
| **Các bước thực hiện** | 1. Kiểm tra email để lấy mã OTP 6 chữ số<br>2. Nhập mã OTP vào các ô nhập<br>3. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | OTP: `123456` (mã nhận được qua email) |
| **Kết quả mong đợi** | - Xác thực OTP thành công<br>- Chuyển sang Bước 3: Đặt mật khẩu mới<br>- Hiển thị form nhập mật khẩu mới |

---

### TC-FP-006: Xác thực OTP sai {#tc-fp-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhập mã OTP không đúng |
| **Điều kiện tiên quyết** | - Đã gửi yêu cầu thành công, mã OTP là `123456`<br>- Người dùng đang ở Bước 2: Nhập OTP |
| **Các bước thực hiện** | 1. Nhập mã OTP sai vào các ô nhập<br>2. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | OTP: `000000` (mã sai) |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mã OTP không đúng"<br>- Vẫn ở Bước 2<br>- Cho phép nhập lại OTP |

---

### TC-FP-007: Xác thực OTP đã hết hạn {#tc-fp-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhập mã OTP sau khi đã hết thời hạn 15 phút |
| **Điều kiện tiên quyết** | - Đã gửi yêu cầu thành công nhưng đã qua 15 phút trở lên<br>- Người dùng đang ở Bước 2: Nhập OTP |
| **Các bước thực hiện** | 1. Chờ OTP hết hạn (15 phút)<br>2. Nhập mã OTP gốc vào các ô nhập<br>3. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | OTP: `123456` (mã đã hết hạn) |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mã OTP đã hết hạn"<br>- Hiển thị tùy chọn gửi lại mã OTP mới<br>- Không cho phép tiếp tục sang Bước 3 |

---

### TC-FP-008: Đặt mật khẩu mới thành công {#tc-fp-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đặt mật khẩu mới với mật khẩu hợp lệ |
| **Điều kiện tiên quyết** | - Đã hoàn thành Bước 1 (gửi email) và Bước 2 (xác thực OTP)<br>- Người dùng đang ở Bước 3: Đặt mật khẩu mới |
| **Các bước thực hiện** | 1. Nhập mật khẩu mới hợp lệ vào trường "Mật khẩu mới"<br>2. Nhập lại mật khẩu vào trường "Xác nhận mật khẩu"<br>3. Nhấn nút "Đặt lại mật khẩu" |
| **Dữ liệu test** | Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `NewPassword@456` |
| **Kết quả mong đợi** | - Mật khẩu được cập nhật thành công<br>- Chuyển sang Bước 4: Xác nhận thành công<br>- Hiển thị thông báo "Mật khẩu đã được đặt lại thành công"<br>- Có link/button chuyển đến trang đăng nhập |

---

### TC-FP-009: Đặt mật khẩu mới không khớp xác nhận {#tc-fp-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đặt mật khẩu mới khi hai trường không giống nhau |
| **Điều kiện tiên quyết** | - Đã hoàn thành Bước 1 và Bước 2<br>- Người dùng đang ở Bước 3: Đặt mật khẩu mới |
| **Các bước thực hiện** | 1. Nhập mật khẩu vào trường "Mật khẩu mới"<br>2. Nhập mật khẩu khác vào trường "Xác nhận mật khẩu"<br>3. Nhấn nút "Đặt lại mật khẩu" |
| **Dữ liệu test** | Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `DifferentPass@789` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu xác nhận không khớp"<br>- Không cập nhật mật khẩu<br>- Vẫn ở Bước 3 |

---

### TC-FP-010: Đặt mật khẩu mới quá yếu {#tc-fp-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đặt mật khẩu mới không đủ tiêu chuẩn bảo mật |
| **Điều kiện tiên quyết** | - Đã hoàn thành Bước 1 và Bước 2<br>- Người dùng đang ở Bước 3 |
| **Các bước thực hiện** | 1. Nhập mật khẩu yếu vào trường "Mật khẩu mới"<br>2. Nhập xác nhận mật khẩu giống<br>3. Nhấn nút "Đặt lại mật khẩu" |
| **Dữ liệu test** | Mật khẩu mới: `123`<br>Xác nhận: `123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi về yêu cầu mật khẩu (độ dài, chữ hoa, ký tự đặc biệt)<br>- Không cập nhật mật khẩu<br>- Vẫn ở Bước 3 |

---

### TC-FP-011: Hoàn thành toàn bộ flow 4 bước {#tc-fp-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thực hiện đầy đủ 4 bước quên mật khẩu và đăng nhập lại |
| **Điều kiện tiên quyết** | - Tài khoản `user@example.com` đã tồn tại, mật khẩu cũ: `OldPassword@123`<br>- Người dùng đang ở trang quên mật khẩu |
| **Các bước thực hiện** | 1. **Bước 1**: Nhập email `user@example.com`, nhấn "Gửi mã xác nhận"<br>2. **Bước 2**: Kiểm tra email, nhập OTP nhận được, nhấn "Xác nhận"<br>3. **Bước 3**: Nhập mật khẩu mới `NewPassword@456` và xác nhận, nhấn "Đặt lại"<br>4. **Bước 4**: Xác nhận thành công, nhấn "Đăng nhập"<br>5. Đăng nhập với mật khẩu mới |
| **Dữ liệu test** | Email: `user@example.com`<br>OTP: (mã nhận qua email)<br>Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `NewPassword@456` |
| **Kết quả mong đợi** | - Tất cả 4 bước hoàn thành suôn sẻ<br>- Step indicator hiển thị tiến trình đúng<br>- Đăng nhập với mật khẩu mới thành công<br>- Đăng nhập với mật khẩu cũ thất bại |

---

### TC-FP-012: Gửi lại OTP {#tc-fp-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi lại mã OTP khi chưa nhận được hoặc mã hết hạn |
| **Điều kiện tiên quyết** | - Đã hoàn thành Bước 1<br>- Người dùng đang ở Bước 2 |
| **Các bước thực hiện** | 1. Nhấn liên kết "Gửi lại mã" hoặc "Resend OTP"<br>2. Chờ email mới<br>3. Nhập mã OTP mới |
| **Dữ liệu test** | Email: `user@example.com`<br>OTP cũ: `123456`<br>OTP mới: (mã mới nhận được) |
| **Kết quả mong đợi** | - Email mới với OTP mới được gửi thành công<br>- OTP cũ bị vô hiệu hóa<br>- OTP mới có thời hạn 15 phút<br>- Hiển thị thông báo "Mã xác nhận đã được gửi lại" |

---

### TC-FP-013: Quay lại bước trước trong flow {#tc-fp-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chức năng quay lại bước trước |
| **Điều kiện tiên quyết** | - Người dùng đang ở Bước 2 hoặc Bước 3 của flow quên mật khẩu |
| **Các bước thực hiện** | 1. Ở Bước 2, nhấn nút "Quay lại"<br>2. Kiểm tra quay về Bước 1 với email đã nhập<br>3. Tiến lại Bước 2, rồi Bước 3<br>4. Ở Bước 3, nhấn "Quay lại" kiểm tra quay về Bước 2 |
| **Dữ liệu test** | Email: `user@example.com` |
| **Kết quả mong đợi** | - Có thể quay lại bước trước mà không mất dữ liệu đã nhập<br>- Step indicator cập nhật đúng<br>- Dữ liệu form được giữ nguyên khi quay lại |

---

### TC-FP-014: Nhấn liên kết quay lại trang đăng nhập {#tc-fp-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra liên kết quay lại trang đăng nhập từ trang quên mật khẩu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang quên mật khẩu (`/forgot-password`) |
| **Các bước thực hiện** | 1. Tìm liên kết "Quay lại đăng nhập" hoặc "Nhớ mật khẩu? Đăng nhập"<br>2. Nhấn vào liên kết |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Chuyển hướng đến trang đăng nhập (`/login`)<br>- Trang đăng nhập hiển thị đúng |

---

### TC-FP-015: Nhập OTP không đủ số ký tự {#tc-fp-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhập mã OTP không đủ 6 chữ số |
| **Điều kiện tiên quyết** | - Đã hoàn thành Bước 1<br>- Người dùng đang ở Bước 2 |
| **Các bước thực hiện** | 1. Nhập chỉ 3 chữ số vào ô OTP<br>2. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | OTP: `123` (chỉ 3 chữ số thay vì 6) |
| **Kết quả mong đợi** | - Nút "Xác nhận" bị vô hiệu hóa hoặc hiển thị lỗi<br>- Không gửi request xác thực<br>- Thông báo yêu cầu nhập đủ 6 chữ số |
