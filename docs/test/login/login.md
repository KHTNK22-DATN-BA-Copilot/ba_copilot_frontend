# Login Feature Testing Document

**Last Updated**: December 13, 2025  
**Feature**: User Authentication - Login  
**Status**: Active Testing

## 1. Testing Document Plan

### Objective
Ensure the login feature functions correctly, securely, and meets user requirements for the BA Copilot application.

### Scope
- Email/Username field validation
- Password field security
- Login button functionality
- Error handling and user feedback
- Session management
- Token refresh mechanism

### Resources
- **Testers**: 2 QA engineers
- **Tools**: Manual testing, automated test scripts (Cypress, Playwright)
- **Test Environment**: Development, Staging

### Schedule
- Test case design: 1 day
- Test execution: 2 days
- Bug fixes and retesting: 1-2 days
- Reporting: 1 day

## 2. Testing Strategy

### Test Types

#### Functional Testing
- Verify email and password fields accept input.
- Validate login with correct credentials.
- Check error messages for invalid email format.
- Check error messages for incorrect password.
- Ensure required field validation.

#### Security Testing
- Test for SQL injection and XSS vulnerabilities.
- Ensure password is not exposed in logs or UI.
- Verify secure transmission (HTTPS).

#### Usability Testing
- Confirm clear error messages.
- Check tab order and accessibility.

#### Performance Testing
- Measure response time for login requests.

### Test Data
- Valid email/password combinations
- Invalid email formats
- Incorrect passwords
- Empty fields

### Acceptance Criteria
- Successful login with valid credentials.
- Appropriate error messages for invalid input.
- No security vulnerabilities.

---
# Login Feature Example Test Cases

## Example Test Cases for Login Feature

### Test Case 1: Successful Login with Valid Credentials

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `user@example.com`<br>Password: `correct_password`                                 |
| Các bước thực hiện      | 1. Nhập email hợp lệ vào trường email.<br>2. Nhập mật khẩu đúng vào trường mật khẩu.<br>3. Nhấn nút đăng nhập. |
| Kết quả mong muốn       | Người dùng đăng nhập thành công và được chuyển đến trang dashboard.                      |

---

### Test Case 2: Invalid Email Format

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `userexample.com`<br>Password: `any_password`                                      |
| Các bước thực hiện      | 1. Nhập email sai định dạng vào trường email.<br>2. Nhập mật khẩu bất kỳ.<br>3. Nhấn nút đăng nhập. |
| Kết quả mong muốn       | Hiển thị thông báo lỗi "Email không đúng định dạng". Đăng nhập không thành công.          |

---

### Test Case 3: Incorrect Password

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `user@example.com`<br>Password: `wrong_password`                                   |
| Các bước thực hiện      | 1. Nhập email hợp lệ vào trường email.<br>2. Nhập mật khẩu sai.<br>3. Nhấn nút đăng nhập. |
| Kết quả mong muốn       | Hiển thị thông báo lỗi "Mật khẩu không đúng". Đăng nhập không thành công.                 |

---

### Test Case 4: Empty Fields Submission

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: *(để trống)*<br>Password: *(để trống)*                                             |
| Các bước thực hiện      | 1. Để trống cả hai trường email và mật khẩu.<br>2. Nhấn nút đăng nhập.                    |
| Kết quả mong muốn       | Hiển thị thông báo lỗi "Email là bắt buộc" và "Mật khẩu là bắt buộc".                     |

---

### Test Case 5: SQL Injection Attempt

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `user@example.com' OR '1'='1`<br>Password: `any_password`                          |
| Các bước thực hiện      | 1. Nhập chuỗi SQL injection vào trường email.<br>2. Nhập mật khẩu bất kỳ.<br>3. Nhấn nút đăng nhập. |
| Kết quả mong muốn       | Đăng nhập không thành công. Không lộ thông tin nhạy cảm. Hệ thống vẫn an toàn.            |

---

### Test Case 6: XSS Injection Attempt

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `<script>alert('xss')</script>`<br>Password: `any_password`                        |
| Các bước thực hiện      | 1. Nhập đoạn mã XSS vào trường email.<br>2. Nhập mật khẩu bất kỳ.<br>3. Nhấn nút đăng nhập. |
| Kết quả mong muốn       | Đăng nhập không thành công. Không thực thi mã JavaScript. Hệ thống vẫn an toàn.           |

---

### Test Case 7: Password Exposed in UI

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: `user@example.com`<br>Password: `any_password`                                     |
| Các bước thực hiện      | 1. Nhập mật khẩu vào trường mật khẩu.<br>2. Kiểm tra xem mật khẩu có bị hiển thị rõ trên giao diện không. |
| Kết quả mong muốn       | Mật khẩu được ẩn (dạng dấu chấm hoặc sao). Không bị lộ trên giao diện.                    |

---

### Test Case 8: Accessibility - Tab Order

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng sử dụng bàn phím để điều hướng trên trang đăng nhập.                           |
| Dữ liệu đầu vào mẫu     | Không áp dụng                                                                            |
| Các bước thực hiện      | 1. Sử dụng phím Tab để chuyển qua các trường nhập và nút đăng nhập.                      |
| Kết quả mong muốn       | Tab order hợp lý, người dùng có thể điều hướng dễ dàng bằng bàn phím.                     |

---

### Test Case 9: Login Button Disabled Until Fields Filled

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng đang ở trang đăng nhập.                                                        |
| Dữ liệu đầu vào mẫu     | Email: *(để trống)*<br>Password: *(để trống)*                                             |
| Các bước thực hiện      | 1. Kiểm tra trạng thái nút đăng nhập khi các trường chưa được nhập.                      |
| Kết quả mong muốn       | Nút đăng nhập bị vô hiệu hóa cho đến khi cả hai trường được nhập dữ liệu hợp lệ.          |

---

### Test Case 10: Multiple Failed Login Attempts

| Tiêu chí                | Nội dung                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện      | Người dùng liên tục nhập sai mật khẩu nhiều lần.                                           |
| Dữ liệu đầu vào mẫu     | Email: `user@example.com`<br>Password: `wrong_password` (lặp lại nhiều lần)                |
| Các bước thực hiện      | 1. Nhập sai mật khẩu liên tiếp 5 lần.<br>2. Quan sát phản hồi của hệ thống.               |
| Kết quả mong muốn       | Hiển thị thông báo cảnh báo hoặc khóa tài khoản tạm thời sau nhiều lần đăng nhập thất bại. |


---
