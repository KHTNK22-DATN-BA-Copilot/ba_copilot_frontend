# Báo Cáo Kiểm Thử - Chức Năng Đăng Ký

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Đăng ký  
**Phiên bản**: 2.0  
**Tổng số test case**: 20

---

## Mục lục

1. [TC-REG-001: Đăng ký thành công với thông tin hợp lệ](#tc-reg-001)
2. [TC-REG-002: Đăng ký với email đã tồn tại](#tc-reg-002)
3. [TC-REG-003: Đăng ký với email sai định dạng](#tc-reg-003)
4. [TC-REG-004: Đăng ký với mật khẩu quá ngắn](#tc-reg-004)
5. [TC-REG-005: Đăng ký với mật khẩu yếu (thiếu ký tự đặc biệt)](#tc-reg-005)
6. [TC-REG-006: Đăng ký khi mật khẩu xác nhận không khớp](#tc-reg-006)
7. [TC-REG-007: Đăng ký khi để trống tất cả các trường](#tc-reg-007)
8. [TC-REG-008: Đăng ký khi để trống trường tên](#tc-reg-008)
9. [TC-REG-009: Đăng ký khi để trống trường email](#tc-reg-009)
10. [TC-REG-010: Đăng ký khi để trống trường mật khẩu](#tc-reg-010)
11. [TC-REG-011: Đăng ký với tên chứa ký tự đặc biệt](#tc-reg-011)
12. [TC-REG-012: Đăng ký với email quá dài](#tc-reg-012)
13. [TC-REG-013: Đăng ký với mật khẩu vượt giới hạn tối đa](#tc-reg-013)
14. [TC-REG-014: Phòng chống SQL Injection qua form đăng ký](#tc-reg-014)
15. [TC-REG-015: Phòng chống XSS qua trường tên](#tc-reg-015)
16. [TC-REG-016: Kiểm tra ẩn/hiện mật khẩu](#tc-reg-016)
17. [TC-REG-017: Đăng ký và chuyển hướng xác thực email](#tc-reg-017)
18. [TC-REG-018: Nhấn liên kết "Đã có tài khoản? Đăng nhập"](#tc-reg-018)
19. [TC-REG-019: Đăng ký với email viết hoa/thường khác nhau](#tc-reg-019)
20. [TC-REG-020: Đăng ký với mật khẩu có khoảng trắng](#tc-reg-020)

---

### TC-REG-001: Đăng ký thành công với thông tin hợp lệ {#tc-reg-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký tài khoản mới thành công |
| **Điều kiện tiên quyết** | - Email chưa từng đăng ký trong hệ thống<br>- Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên đầy đủ vào trường "Tên"<br>2. Nhập email hợp lệ vào trường "Email"<br>3. Nhập mật khẩu mạnh vào trường "Mật khẩu"<br>4. Nhập lại mật khẩu vào trường "Xác nhận mật khẩu"<br>5. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Nguyễn Văn A`<br>Email: `newuser@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Đăng ký thành công<br>- Hệ thống gửi email xác thực OTP (6 chữ số, hết hạn sau 15 phút)<br>- Người dùng được chuyển hướng đến trang xác thực email (`/verify-email`)<br>- Mật khẩu được hash bằng bcrypt trước khi lưu |

---

### TC-REG-002: Đăng ký với email đã tồn tại {#tc-reg-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với email đã được sử dụng |
| **Điều kiện tiên quyết** | - Email `existing@example.com` đã tồn tại trong hệ thống<br>- Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên vào trường "Tên"<br>2. Nhập email đã tồn tại vào trường "Email"<br>3. Nhập mật khẩu hợp lệ<br>4. Xác nhận mật khẩu<br>5. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Nguyễn Văn B`<br>Email: `existing@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email đã được sử dụng"<br>- Đăng ký không thành công<br>- Không tạo tài khoản mới |

---

### TC-REG-003: Đăng ký với email sai định dạng {#tc-reg-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với email không đúng format |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên hợp lệ<br>2. Nhập email sai định dạng<br>3. Nhập mật khẩu và xác nhận mật khẩu<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Nguyễn Văn C`<br>Email: `invalidemail.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email không đúng định dạng"<br>- Đăng ký không thành công |

---

### TC-REG-004: Đăng ký với mật khẩu quá ngắn {#tc-reg-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với mật khẩu ít hơn số ký tự tối thiểu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên và email hợp lệ<br>2. Nhập mật khẩu quá ngắn (dưới 6 ký tự)<br>3. Xác nhận mật khẩu<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test@example.com`<br>Password: `Ab@1`<br>Confirm Password: `Ab@1` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu phải có ít nhất 6 ký tự"<br>- Đăng ký không thành công |

---

### TC-REG-005: Đăng ký với mật khẩu yếu {#tc-reg-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với mật khẩu thiếu ký tự đặc biệt hoặc chữ hoa |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên và email hợp lệ<br>2. Nhập mật khẩu chỉ có chữ thường và số<br>3. Xác nhận mật khẩu<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test2@example.com`<br>Password: `password123`<br>Confirm Password: `password123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi yêu cầu mật khẩu có chữ hoa, chữ thường, số và ký tự đặc biệt<br>- Đăng ký không thành công |

---

### TC-REG-006: Đăng ký khi mật khẩu xác nhận không khớp {#tc-reg-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi hai trường mật khẩu không giống nhau |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên và email hợp lệ<br>2. Nhập mật khẩu vào trường "Mật khẩu"<br>3. Nhập mật khẩu khác vào trường "Xác nhận mật khẩu"<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test3@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@456` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu xác nhận không khớp"<br>- Đăng ký không thành công |

---

### TC-REG-007: Đăng ký khi để trống tất cả các trường {#tc-reg-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi không nhập bất kỳ thông tin nào |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Để trống tất cả các trường<br>2. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: *(để trống)*<br>Email: *(để trống)*<br>Password: *(để trống)*<br>Confirm Password: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi cho từng trường bắt buộc<br>- Nút đăng ký có thể bị vô hiệu hóa<br>- Đăng ký không thành công |

---

### TC-REG-008: Đăng ký khi để trống trường tên {#tc-reg-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi không nhập tên người dùng |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Để trống trường "Tên"<br>2. Nhập email, mật khẩu và xác nhận mật khẩu hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: *(để trống)*<br>Email: `test4@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Tên là bắt buộc"<br>- Đăng ký không thành công |

---

### TC-REG-009: Đăng ký khi để trống trường email {#tc-reg-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi không nhập email |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên hợp lệ<br>2. Để trống trường "Email"<br>3. Nhập mật khẩu và xác nhận mật khẩu<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: *(để trống)*<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email là bắt buộc"<br>- Đăng ký không thành công |

---

### TC-REG-010: Đăng ký khi để trống trường mật khẩu {#tc-reg-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi không nhập mật khẩu |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên và email hợp lệ<br>2. Để trống trường "Mật khẩu" và "Xác nhận mật khẩu"<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test5@example.com`<br>Password: *(để trống)*<br>Confirm Password: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu là bắt buộc"<br>- Đăng ký không thành công |

---

### TC-REG-011: Đăng ký với tên chứa ký tự đặc biệt {#tc-reg-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký khi tên chứa ký tự đặc biệt và số |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập tên có ký tự đặc biệt<br>2. Nhập email, mật khẩu và xác nhận mật khẩu hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `User<>!@#$%`<br>Email: `test6@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hệ thống xử lý an toàn (sanitize) ký tự đặc biệt<br>- Không gây lỗi hệ thống hoặc lỗ hổng bảo mật<br>- Đăng ký thành công hoặc hiển thị thông báo tên không hợp lệ |

---

### TC-REG-012: Đăng ký với email quá dài {#tc-reg-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với email vượt quá giới hạn 255 ký tự |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập email dài hơn 255 ký tự<br>2. Nhập các trường khác hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `aaaaaa....(256 ký tự)...@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi email quá dài hoặc không hợp lệ<br>- Đăng ký không thành công<br>- Không gây lỗi database (varchar 255) |

---

### TC-REG-013: Đăng ký với mật khẩu vượt giới hạn tối đa {#tc-reg-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với mật khẩu vượt quá 72 byte (giới hạn bcrypt) |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập mật khẩu dài hơn 72 ký tự<br>2. Nhập các trường khác hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test7@example.com`<br>Password: `Aa@1` + 70 ký tự `x` (tổng 74 ký tự)<br>Confirm Password: (giống password) |
| **Kết quả mong đợi** | - Backend xử lý truncation đúng cho bcrypt (72 byte)<br>- Đăng ký thành công hoặc thông báo mật khẩu quá dài<br>- Không gây lỗi hash |

---

### TC-REG-014: Phòng chống SQL Injection qua form đăng ký {#tc-reg-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra bảo mật SQL Injection trên form đăng ký |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập chuỗi SQL Injection vào trường "Email"<br>2. Nhập các trường khác hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `'; DROP TABLE users; --`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Đăng ký không thành công<br>- Hệ thống không thực thi câu lệnh SQL<br>- Database không bị ảnh hưởng<br>- Không lộ thông tin cấu trúc hệ thống |

---

### TC-REG-015: Phòng chống XSS qua trường tên {#tc-reg-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra bảo mật XSS qua trường nhập tên |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập mã JavaScript vào trường "Tên"<br>2. Nhập email, mật khẩu hợp lệ<br>3. Nhấn nút "Đăng ký"<br>4. Nếu đăng ký thành công, kiểm tra hiển thị tên trên profile |
| **Dữ liệu test** | Tên: `<script>alert('XSS')</script>`<br>Email: `xsstest@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Mã JavaScript không được thực thi<br>- Tên được sanitize/escape an toàn<br>- Không có cửa sổ alert hiện lên ở bất kỳ trang nào |

---

### TC-REG-016: Kiểm tra ẩn/hiện mật khẩu {#tc-reg-016}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chức năng toggle ẩn/hiện mật khẩu khi đăng ký |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập mật khẩu vào trường "Mật khẩu"<br>2. Nhấn icon hiện mật khẩu — quan sát<br>3. Nhấn lại icon — quan sát<br>4. Lặp lại cho trường "Xác nhận mật khẩu" |
| **Dữ liệu test** | Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Mặc định: mật khẩu bị ẩn (dạng dấu chấm)<br>- Nhấn icon: mật khẩu hiện rõ<br>- Nhấn lại: mật khẩu ẩn trở lại<br>- Cả hai trường đều hoạt động độc lập |

---

### TC-REG-017: Đăng ký và chuyển hướng xác thực email {#tc-reg-017}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra flow chuyển hướng sau đăng ký thành công |
| **Điều kiện tiên quyết** | - Email chưa từng đăng ký<br>- Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập đầy đủ thông tin hợp lệ<br>2. Nhấn nút "Đăng ký"<br>3. Quan sát trang chuyển hướng<br>4. Kiểm tra email đã nhận được mã OTP |
| **Dữ liệu test** | Tên: `Nguyễn Văn D`<br>Email: `newreg@example.com`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Đăng ký thành công<br>- Chuyển hướng đến trang `/verify-email`<br>- Email xác thực được gửi với mã OTP 6 chữ số<br>- OTP có thời hạn 15 phút |

---

### TC-REG-018: Nhấn liên kết "Đã có tài khoản? Đăng nhập" {#tc-reg-018}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra liên kết chuyển đến trang đăng nhập |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Tìm liên kết "Đã có tài khoản? Đăng nhập" ở cuối form<br>2. Nhấn vào liên kết |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Người dùng được chuyển hướng đến trang đăng nhập (`/login`)<br>- Trang đăng nhập hiển thị đúng |

---

### TC-REG-019: Đăng ký với email viết hoa/thường khác nhau {#tc-reg-019}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra email case-insensitive khi đăng ký |
| **Điều kiện tiên quyết** | - Email `existing@example.com` đã tồn tại (chữ thường)<br>- Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập email viết hoa: `EXISTING@EXAMPLE.COM`<br>2. Nhập các trường khác hợp lệ<br>3. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `EXISTING@EXAMPLE.COM`<br>Password: `Password@123`<br>Confirm Password: `Password@123` |
| **Kết quả mong đợi** | - Hệ thống nhận diện email trùng (case-insensitive)<br>- Hiển thị thông báo "Email đã được sử dụng"<br>- Đăng ký không thành công |

---

### TC-REG-020: Đăng ký với mật khẩu có khoảng trắng {#tc-reg-020}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng ký với mật khẩu chứa khoảng trắng đầu/cuối |
| **Điều kiện tiên quyết** | - Người dùng đang ở trang đăng ký (`/register`) |
| **Các bước thực hiện** | 1. Nhập mật khẩu có khoảng trắng ở đầu và cuối<br>2. Nhập xác nhận mật khẩu giống hệt<br>3. Nhập các trường khác hợp lệ<br>4. Nhấn nút "Đăng ký" |
| **Dữ liệu test** | Tên: `Test User`<br>Email: `test8@example.com`<br>Password: ` Password@123 ` (có khoảng trắng đầu/cuối)<br>Confirm Password: ` Password@123 ` |
| **Kết quả mong đợi** | - Hệ thống xử lý mật khẩu đúng (không trim hoặc trim nhất quán)<br>- Nếu trim: sau đăng nhập, mật khẩu không có khoảng trắng vẫn đăng nhập được<br>- Nếu không trim: mật khẩu giữ nguyên khoảng trắng |
