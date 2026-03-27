# Báo Cáo Kiểm Thử - Chức Năng Xác Thực Email

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Xác thực email  
**Phiên bản**: 2.0  
**Tổng số test case**: 8

---

## Mục lục

1. [TC-VE-001: Xác thực email thành công với OTP đúng](#tc-ve-001)
2. [TC-VE-002: Xác thực email với OTP sai](#tc-ve-002)
3. [TC-VE-003: Xác thực email với OTP đã hết hạn](#tc-ve-003)
4. [TC-VE-004: Gửi lại mã OTP xác thực email](#tc-ve-004)
5. [TC-VE-005: Trang xác thực thành công hiển thị đúng](#tc-ve-005)
6. [TC-VE-006: Tự động chuyển hướng sau xác thực thành công](#tc-ve-006)
7. [TC-VE-007: Truy cập trang xác thực khi đã xác thực rồi](#tc-ve-007)
8. [TC-VE-008: Xác thực email khi để trống OTP](#tc-ve-008)

---

### TC-VE-001: Xác thực email thành công với OTP đúng {#tc-ve-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác thực email bằng mã OTP hợp lệ sau khi đăng ký |
| **Điều kiện tiên quyết** | - Vừa đăng ký tài khoản thành công<br>- Hệ thống đã gửi email chứa mã OTP 6 chữ số (hạn 15 phút)<br>- Người dùng đang ở trang xác thực email (`/verify-email`) |
| **Các bước thực hiện** | 1. Kiểm tra email để lấy mã OTP 6 chữ số<br>2. Nhập mã OTP đúng vào các ô nhập trên trang xác thực<br>3. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | Email: `newuser@example.com`<br>OTP: `123456` (mã nhận được qua email) |
| **Kết quả mong đợi** | - Xác thực thành công<br>- Trường `email_verified` được cập nhật thành `true` trong database<br>- Chuyển hướng đến trang xác thực thành công (`/verify-success`)<br>- Hiển thị thông báo thành công |

---

### TC-VE-002: Xác thực email với OTP sai {#tc-ve-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác thực email bằng mã OTP không đúng |
| **Điều kiện tiên quyết** | - Vừa đăng ký tài khoản, mã OTP thật là `123456`<br>- Người dùng đang ở trang xác thực email (`/verify-email`) |
| **Các bước thực hiện** | 1. Nhập mã OTP sai vào các ô nhập<br>2. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | Email: `newuser@example.com`<br>OTP: `999999` (mã sai) |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mã xác nhận không đúng"<br>- Email vẫn chưa được xác thực (`email_verified = false`)<br>- Cho phép nhập lại mã |

---

### TC-VE-003: Xác thực email với OTP đã hết hạn {#tc-ve-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác thực email bằng mã OTP đã quá 15 phút |
| **Điều kiện tiên quyết** | - Đã đăng ký tài khoản và nhận mã OTP<br>- Đã chờ hơn 15 phút kể từ khi nhận OTP<br>- Người dùng đang ở trang xác thực email |
| **Các bước thực hiện** | 1. Nhập mã OTP gốc (đúng nhưng đã hết hạn)<br>2. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | Email: `newuser@example.com`<br>OTP: `123456` (đã quá 15 phút) |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mã xác nhận đã hết hạn"<br>- Hiển thị tùy chọn gửi lại mã mới<br>- Email vẫn chưa được xác thực |

---

### TC-VE-004: Gửi lại mã OTP xác thực email {#tc-ve-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi lại mã OTP khi mã cũ hết hạn hoặc không nhận được |
| **Điều kiện tiên quyết** | - Đã đăng ký tài khoản<br>- Người dùng đang ở trang xác thực email (`/verify-email`) |
| **Các bước thực hiện** | 1. Nhấn liên kết "Gửi lại mã" trên trang xác thực<br>2. Chờ email mới<br>3. Kiểm tra hộp thư |
| **Dữ liệu test** | Email: `newuser@example.com` |
| **Kết quả mong đợi** | - Email mới chứa OTP mới được gửi thành công<br>- OTP cũ bị vô hiệu hóa<br>- OTP mới có thời hạn 15 phút<br>- Hiển thị thông báo "Mã xác nhận đã được gửi lại" |

---

### TC-VE-005: Trang xác thực thành công hiển thị đúng {#tc-ve-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra giao diện trang xác thực email thành công |
| **Điều kiện tiên quyết** | - Vừa xác thực email thành công<br>- Được chuyển hướng đến trang `/verify-success` |
| **Các bước thực hiện** | 1. Sau khi xác thực OTP thành công, quan sát trang `/verify-success`<br>2. Kiểm tra hiển thị các trạng thái: thành công, lỗi, hết hạn<br>3. Kiểm tra animation/hiệu ứng |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Hiển thị icon/animation thành công<br>- Hiển thị thông báo "Email đã được xác thực thành công"<br>- Có nút hoặc link chuyển đến trang đăng nhập<br>- Hiển thị đếm ngược tự động chuyển hướng (5 giây) |

---

### TC-VE-006: Tự động chuyển hướng sau xác thực thành công {#tc-ve-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra auto-redirect sau 5 giây trên trang verify-success |
| **Điều kiện tiên quyết** | - Đang ở trang `/verify-success` sau khi xác thực thành công |
| **Các bước thực hiện** | 1. Quan sát trang verify-success<br>2. Chờ bộ đếm ngược 5 giây<br>3. Quan sát chuyển hướng tự động |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Hiển thị đếm ngược từ 5 đến 0<br>- Sau 5 giây, tự động chuyển hướng đến trang đăng nhập (`/login`)<br>- Trang đăng nhập hiển thị đúng |

---

### TC-VE-007: Truy cập trang xác thực khi đã xác thực rồi {#tc-ve-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập lại trang verify-email khi email đã xác thực |
| **Điều kiện tiên quyết** | - Tài khoản đã xác thực email trước đó (`email_verified = true`) |
| **Các bước thực hiện** | 1. Truy cập trực tiếp URL `/verify-email`<br>2. Quan sát phản hồi hệ thống |
| **Dữ liệu test** | Email: `verified@example.com` (đã xác thực) |
| **Kết quả mong đợi** | - Chuyển hướng đến trang đăng nhập hoặc dashboard<br>- Hoặc hiển thị thông báo "Email đã được xác thực"<br>- Không cho phép xác thực lại |

---

### TC-VE-008: Xác thực email khi để trống OTP {#tc-ve-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhấn xác nhận khi chưa nhập mã OTP |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang xác thực email (`/verify-email`) |
| **Các bước thực hiện** | 1. Để trống tất cả ô nhập OTP<br>2. Nhấn nút "Xác nhận" |
| **Dữ liệu test** | OTP: *(để trống)* |
| **Kết quả mong đợi** | - Nút "Xác nhận" bị vô hiệu hóa hoặc hiển thị lỗi<br>- Không gửi request đến server<br>- Thông báo yêu cầu nhập mã OTP |
