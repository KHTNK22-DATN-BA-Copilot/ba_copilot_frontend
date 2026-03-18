# Báo Cáo Kiểm Thử - Chức Năng Đăng Nhập

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Đăng nhập  
**Phiên bản**: 2.0  
**Tổng số test case**: 15

---

## Mục lục

1. [TC-LOGIN-001: Đăng nhập thành công với thông tin hợp lệ](#tc-login-001)
2. [TC-LOGIN-002: Đăng nhập với email sai định dạng](#tc-login-002)
3. [TC-LOGIN-003: Đăng nhập với mật khẩu sai](#tc-login-003)
4. [TC-LOGIN-004: Đăng nhập với email không tồn tại](#tc-login-004)
5. [TC-LOGIN-005: Đăng nhập khi để trống cả hai trường](#tc-login-005)
6. [TC-LOGIN-006: Đăng nhập khi để trống trường email](#tc-login-006)
7. [TC-LOGIN-007: Đăng nhập khi để trống trường mật khẩu](#tc-login-007)
8. [TC-LOGIN-008: Kiểm tra ẩn/hiện mật khẩu](#tc-login-008)
9. [TC-LOGIN-009: Kiểm tra nút đăng nhập bị vô hiệu hóa khi chưa nhập đủ](#tc-login-009)
10. [TC-LOGIN-010: Phòng chống SQL Injection](#tc-login-010)
11. [TC-LOGIN-011: Phòng chống XSS Injection](#tc-login-011)
12. [TC-LOGIN-012: Đăng nhập nhiều lần thất bại liên tiếp](#tc-login-012)
13. [TC-LOGIN-013: Chuyển hướng sau đăng nhập thành công](#tc-login-013)
14. [TC-LOGIN-014: Điều hướng bằng bàn phím (Tab order)](#tc-login-014)
15. [TC-LOGIN-015: Đăng nhập với tài khoản chưa xác thực email](#tc-login-015)

---

### TC-LOGIN-001: Đăng nhập thành công với thông tin hợp lệ {#tc-login-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập thành công với email và mật khẩu hợp lệ |
| **Điều kiện tiên quyết** | - Tài khoản đã được đăng ký và xác thực email thành công<br>- Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email hợp lệ vào trường "Email"<br>2. Nhập mật khẩu đúng vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Đăng nhập thành công<br>- Access token (30 phút) và refresh token (7 ngày) được lưu vào cookie httpOnly<br>- Người dùng được chuyển hướng đến trang Dashboard (`/dashboard`) |

---

### TC-LOGIN-002: Đăng nhập với email sai định dạng {#tc-login-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập với email không đúng định dạng |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email sai định dạng vào trường "Email"<br>2. Nhập mật khẩu bất kỳ vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `userexample.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email không đúng định dạng"<br>- Đăng nhập không thành công<br>- Người dùng vẫn ở trang đăng nhập |

---

### TC-LOGIN-003: Đăng nhập với mật khẩu sai {#tc-login-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập với mật khẩu không đúng |
| **Điều kiện tiên quyết** | - Tài khoản `user@example.com` đã tồn tại trong hệ thống<br>- Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email hợp lệ vào trường "Email"<br>2. Nhập mật khẩu sai vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `WrongPassword@456` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Đăng nhập không thành công<br>- Không tiết lộ cụ thể email hay mật khẩu sai |

---

### TC-LOGIN-004: Đăng nhập với email không tồn tại {#tc-login-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập với email chưa đăng ký trong hệ thống |
| **Điều kiện tiên quyết** | - Email `notexist@example.com` chưa được đăng ký<br>- Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email chưa đăng ký vào trường "Email"<br>2. Nhập mật khẩu bất kỳ vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `notexist@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Đăng nhập không thành công<br>- Không tiết lộ email chưa tồn tại (bảo mật) |

---

### TC-LOGIN-005: Đăng nhập khi để trống cả hai trường {#tc-login-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập khi không nhập email và mật khẩu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Để trống trường "Email"<br>2. Để trống trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: *(để trống)*<br>Password: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email là bắt buộc" và "Mật khẩu là bắt buộc"<br>- Nút đăng nhập có thể bị vô hiệu hóa<br>- Đăng nhập không thành công |

---

### TC-LOGIN-006: Đăng nhập khi để trống trường email {#tc-login-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập khi chỉ nhập mật khẩu, bỏ trống email |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Để trống trường "Email"<br>2. Nhập mật khẩu vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: *(để trống)*<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email là bắt buộc"<br>- Đăng nhập không thành công |

---

### TC-LOGIN-007: Đăng nhập khi để trống trường mật khẩu {#tc-login-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập khi chỉ nhập email, bỏ trống mật khẩu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email hợp lệ vào trường "Email"<br>2. Để trống trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu là bắt buộc"<br>- Đăng nhập không thành công |

---

### TC-LOGIN-008: Kiểm tra ẩn/hiện mật khẩu {#tc-login-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chức năng hiển thị và ẩn mật khẩu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập mật khẩu vào trường "Mật khẩu"<br>2. Quan sát mật khẩu hiển thị dạng ẩn (dấu chấm/sao)<br>3. Nhấn biểu tượng "Hiện mật khẩu" (icon mắt)<br>4. Quan sát mật khẩu hiển thị dạng rõ<br>5. Nhấn lại biểu tượng để ẩn mật khẩu |
| **Dữ liệu test** | Password: `Password@123` |
| **Kết quả mong đợi** | - Mặc định mật khẩu được ẩn (type="password")<br>- Khi nhấn icon mắt, mật khẩu hiển thị rõ (type="text")<br>- Khi nhấn lại, mật khẩu ẩn trở lại |

---

### TC-LOGIN-009: Kiểm tra nút đăng nhập bị vô hiệu hóa khi chưa nhập đủ {#tc-login-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nút đăng nhập bị disable khi form chưa hợp lệ |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Để trống cả hai trường và quan sát trạng thái nút "Đăng nhập"<br>2. Nhập email hợp lệ nhưng để trống mật khẩu, quan sát nút<br>3. Nhập mật khẩu nhưng để trống email, quan sát nút<br>4. Nhập cả email và mật khẩu hợp lệ, quan sát nút |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Bước 1: Nút "Đăng nhập" bị vô hiệu hóa (disabled)<br>- Bước 2-3: Nút vẫn bị vô hiệu hóa<br>- Bước 4: Nút được kích hoạt (enabled) |

---

### TC-LOGIN-010: Phòng chống SQL Injection {#tc-login-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hệ thống phòng chống tấn công SQL Injection |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập chuỗi SQL Injection vào trường "Email"<br>2. Nhập mật khẩu bất kỳ<br>3. Nhấn nút "Đăng nhập"<br>4. Quan sát phản hồi hệ thống |
| **Dữ liệu test** | Email: `' OR '1'='1' --`<br>Password: `anything` |
| **Kết quả mong đợi** | - Đăng nhập không thành công<br>- Hệ thống không thực thi câu lệnh SQL<br>- Không lộ thông tin nhạy cảm (cấu trúc DB, stack trace)<br>- Hệ thống vẫn hoạt động bình thường |

---

### TC-LOGIN-011: Phòng chống XSS Injection {#tc-login-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hệ thống phòng chống tấn công XSS |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập đoạn mã JavaScript vào trường "Email"<br>2. Nhập mật khẩu bất kỳ<br>3. Nhấn nút "Đăng nhập"<br>4. Quan sát giao diện không thực thi mã JS |
| **Dữ liệu test** | Email: `<script>alert('xss')</script>`<br>Password: `anything` |
| **Kết quả mong đợi** | - Đăng nhập không thành công<br>- Không có cửa sổ alert hiện lên<br>- Mã JavaScript không được thực thi<br>- Input được sanitize hoặc escape đúng cách |

---

### TC-LOGIN-012: Đăng nhập nhiều lần thất bại liên tiếp {#tc-login-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra phản hồi khi đăng nhập sai nhiều lần liên tiếp |
| **Điều kiện tiên quyết** | - Tài khoản `user@example.com` đã tồn tại<br>- Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhập email đúng và mật khẩu sai, nhấn "Đăng nhập"<br>2. Lặp lại bước 1 tổng cộng 5 lần liên tiếp<br>3. Quan sát phản hồi hệ thống sau mỗi lần |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `WrongPass@1`, `WrongPass@2`, `WrongPass@3`, `WrongPass@4`, `WrongPass@5` |
| **Kết quả mong đợi** | - Mỗi lần thất bại đều hiển thị thông báo lỗi phù hợp<br>- Sau nhiều lần thất bại, hệ thống có thể hiển thị cảnh báo hoặc rate-limit<br>- Không khóa vĩnh viễn tài khoản |

---

### TC-LOGIN-013: Chuyển hướng sau đăng nhập thành công {#tc-login-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chuyển hướng đúng trang sau đăng nhập |
| **Điều kiện tiên quyết** | - Tài khoản đã đăng ký và xác thực thành công<br>- Người dùng truy cập trang được bảo vệ khi chưa đăng nhập, bị redirect về `/login` |
| **Các bước thực hiện** | 1. Truy cập trực tiếp URL `/dashboard` khi chưa đăng nhập<br>2. Hệ thống chuyển hướng về trang `/login`<br>3. Đăng nhập với thông tin hợp lệ<br>4. Quan sát URL sau khi đăng nhập thành công |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Sau đăng nhập thành công, người dùng được chuyển hướng đến trang `/dashboard`<br>- URL hiển thị đúng `/dashboard`<br>- Access token và refresh token được lưu cookie |

---

### TC-LOGIN-014: Điều hướng bằng bàn phím (Tab order) {#tc-login-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra khả năng điều hướng form đăng nhập bằng bàn phím |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng nhập (`/login`) |
| **Các bước thực hiện** | 1. Nhấn phím Tab lần 1 — focus vào trường "Email"<br>2. Nhập email<br>3. Nhấn Tab lần 2 — focus vào trường "Mật khẩu"<br>4. Nhập mật khẩu<br>5. Nhấn Tab lần 3 — focus vào nút "Đăng nhập"<br>6. Nhấn Enter để submit form |
| **Dữ liệu test** | Email: `user@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Tab order hợp lý: Email → Mật khẩu → Nút đăng nhập<br>- Có thể submit form bằng phím Enter<br>- Focus indicator hiển thị rõ ràng trên mỗi element |

---

### TC-LOGIN-015: Đăng nhập với tài khoản chưa xác thực email {#tc-login-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng nhập với email đã đăng ký nhưng chưa xác thực |
| **Điều kiện tiên quyết** | - Tài khoản `unverified@example.com` đã đăng ký nhưng chưa xác thực email (email_verified = false) |
| **Các bước thực hiện** | 1. Nhập email chưa xác thực vào trường "Email"<br>2. Nhập mật khẩu đúng vào trường "Mật khẩu"<br>3. Nhấn nút "Đăng nhập" |
| **Dữ liệu test** | Email: `unverified@example.com`<br>Password: `Password@123` |
| **Kết quả mong đợi** | - Hệ thống thông báo email chưa được xác thực<br>- Có thể chuyển hướng đến trang xác thực email<br>- Không cho phép truy cập dashboard khi chưa xác thực |
