## Kế hoạch test: Chức năng quên mật khẩu

### Tổng quan
Tài liệu test này cover chức năng quên mật khẩu, gồm có 4 bước:
- Nhập email
- Nhập mã pin
- Nhập mật khẩu mới và confirm password
- Đổi mật khẩu thành công

### Test Cases

#### 1. Valid Email and PIN Flow

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng muốn đặt lại mật khẩu khi quên.                                                     |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 123456<br>Mật khẩu mới: Abc@1234                              |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Nhập đúng mã PIN nhận qua email.<br>3. Nhập mật khẩu mới và xác nhận mật khẩu.<br>4. Nhấn nút xác nhận thành công. |
| Kết quả mong muốn        | Người dùng được chuyển đến trang đăng nhập và đăng nhập thành công với mật khẩu mới.           |
| Kết quả thực tế          | Passed/Failed                                                                                 |

---

#### 2. Invalid Email Entry

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập email không hợp lệ hoặc chưa đăng ký.                                         |
| Dữ liệu đầu vào mẫu      | Email: invalid_email<br>PIN: --                                                               |
| Các bước thực hiện       | 1. Nhập email chưa đăng ký hoặc sai định dạng.<br>2. Nhấn tiếp tục.                           |
| Kết quả mong muốn        | Hiển thị thông báo lỗi, không cho phép chuyển sang bước nhập PIN.                             |
| Kết quả thực tế          |                                                                               |

---

#### 3. Incorrect PIN Entry

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập sai mã PIN.                                                                   |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 654321                                                        |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Nhập sai mã PIN.                                              |
| Kết quả mong muốn        | Hiển thị thông báo lỗi, không cho phép đặt lại mật khẩu.                                      |
| Kết quả thực tế          |                                                                           |

---

#### 4. Correct PIN Entry

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập đúng mã PIN để chuyển sang bước tiếp theo.                                    |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 123456                                                        |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Nhập đúng mã PIN.<br>3. Nhấn xác nhận.                        |
| Kết quả mong muốn        | Chuyển sang bước đặt lại mật khẩu.                                                            |
| Kết quả thực tế          |                                                                          |

---

#### 5. Password Mismatch

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập mật khẩu mới và xác nhận mật khẩu không khớp.                                 |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 123456<br>Mật khẩu mới: Abc@1234<br>Xác nhận: Abc@12345       |
| Các bước thực hiện       | 1. Nhập email đã đăng ký và mã PIN đúng.<br>2. Nhập mật khẩu mới và xác nhận không khớp.<br>3. Nhấn xác nhận. |
| Kết quả mong muốn        | Nút xác nhận bị vô hiệu hóa, người dùng không thể tiếp tục.                                   |
| Kết quả thực tế          |                                                          |
#### 6. Empty Email Field

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng để trống trường email khi yêu cầu đặt lại mật khẩu.                                 |
| Dữ liệu đầu vào mẫu      | Email: (trống)<br>PIN: --                                                                     |
| Các bước thực hiện       | 1. Để trống trường email.<br>2. Nhấn tiếp tục.                                                |
| Kết quả mong muốn        | Hiển thị thông báo lỗi yêu cầu nhập email, không cho phép chuyển sang bước tiếp theo.          |
| Kết quả thực tế          |                                                          |

---

#### 7. Empty PIN Field

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng để trống trường PIN khi xác thực.                                                  |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: (trống)                                                       |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Để trống trường PIN.<br>3. Nhấn xác nhận.                     |
| Kết quả mong muốn        | Hiển thị thông báo lỗi yêu cầu nhập PIN, không cho phép tiếp tục.                             |
| Kết quả thực tế          |                                                          |

---

#### 8. Weak New Password

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập mật khẩu mới không đáp ứng yêu cầu bảo mật.                                    |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 123456<br>Mật khẩu mới: 12345                                 |
| Các bước thực hiện       | 1. Nhập email đã đăng ký và mã PIN đúng.<br>2. Nhập mật khẩu mới yếu.<br>3. Nhấn xác nhận.    |
| Kết quả mong muốn        | Hiển thị thông báo lỗi về độ mạnh mật khẩu, không cho phép tiếp tục.                          |
| Kết quả thực tế          |                                                          |

---

#### 9. Expired PIN

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập mã PIN đã hết hạn.                                                            |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 999999                                                        |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Nhập mã PIN đã hết hạn.<br>3. Nhấn xác nhận.                  |
| Kết quả mong muốn        | Hiển thị thông báo lỗi mã PIN hết hạn, yêu cầu gửi lại mã mới.                                |
| Kết quả thực tế          |                                                          |

---

#### 10. Multiple Incorrect PIN Attempts

| **Tiêu chí**             | **Nội dung**                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| Ngữ cảnh thực hiện       | Người dùng nhập sai mã PIN nhiều lần liên tiếp.                                                |
| Dữ liệu đầu vào mẫu      | Email: user@example.com<br>PIN: 654321 (nhập sai nhiều lần)                                   |
| Các bước thực hiện       | 1. Nhập email đã đăng ký.<br>2. Nhập sai mã PIN nhiều lần.<br>3. Nhấn xác nhận mỗi lần.       |
| Kết quả mong muốn        | Tài khoản bị khóa tạm thời hoặc yêu cầu xác thực bổ sung.                                      |
| Kết quả thực tế          |                                                          |




