## Kế hoạch test: Chức năng đăng ký tài khoản

### Tổng quan

Tài liệu test này cover chức năng đăng ký tài khoản, gồm có 3 bước chính:

-   Điền thông tin đăng ký và validation
-   Xác thực email qua PIN được gửi tự động
-   Hoàn tất đăng ký và chuyển đến trang đăng nhập

### Test Cases

#### 1. Successful Registration Flow

| **Tiêu chí**        | **Nội dung**                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng đăng ký tài khoản mới với thông tin hợp lệ.                                                                                  |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: Test@1234<br>Confirm: Test@1234                                                  |
| Các bước thực hiện  | 1. Nhập đầy đủ thông tin hợp lệ.<br>2. Click "Create Account".<br>3. Kiểm tra chuyển đến verify-email.<br>4. Xác thực email thành công. |
| Kết quả mong muốn   | Đăng ký thành công, chuyển đến trang xác thực email, sau đó đến trang login.                                                            |
| Kết quả thực tế     | Điền đúng thông tin, đăng ký thành công, đăng nhập được.                                                                                                                                        |

---

#### 2. Empty Name Field

| **Tiêu chí**        | **Nội dung**                                                                          |
| ------------------- | ------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng để trống trường họ tên.                                                    |
| Dữ liệu đầu vào mẫu | Name: (trống)<br>Email: john@example.com<br>Password: Test@1234<br>Confirm: Test@1234 |
| Các bước thực hiện  | 1. Để trống trường Name.<br>2. Nhập các thông tin khác.<br>3. Click "Create Account". |
| Kết quả mong muốn   | Hiển thị lỗi "Name is required", nút Create Account bị disable.                       |
| Kết quả thực tế     |   Nút "Create account" không ấn được, giao diện nút có màu xám.                                                                                    |

---

#### 3. Name Too Short

| **Tiêu chí**        | **Nội dung**                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập tên quá ngắn (ít hơn 2 ký tự).                                               |
| Dữ liệu đầu vào mẫu | Name: A<br>Email: john@example.com<br>Password: Test@1234<br>Confirm: Test@1234              |
| Các bước thực hiện  | 1. Nhập tên chỉ 1 ký tự.<br>2. Nhập các thông tin khác hợp lệ.<br>3. Click "Create Account". |
| Kết quả mong muốn   | Hiển thị lỗi "Name must be at least 2 characters", form không submit.                        |
| Kết quả thực tế     |  Hiển thị thông báo lỗi màu đỏ bên dưới ô nhập tên: Name must be at least 2 characters.                                                                                             |

---

#### 4. Invalid Email Format

| **Tiêu chí**        | **Nội dung**                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập email không đúng định dạng.                                                   |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: invalid-email<br>Password: Test@1234<br>Confirm: Test@1234           |
| Các bước thực hiện  | 1. Nhập email sai format.<br>2. Nhập các thông tin khác hợp lệ.<br>3. Click "Create Account". |
| Kết quả mong muốn   | Hiển thị lỗi "Please enter a valid email address", nút Create Account bị disable.             |
| Kết quả thực tế     | Hiển thị thông báo lỗi màu đỏ bên dưới ô nhập tên: "Please enter a valid email address.                                                                                              |

---

#### 5. Empty Email Field

| **Tiêu chí**        | **Nội dung**                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng để trống trường email.                                                      |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: (trống)<br>Password: Test@1234<br>Confirm: Test@1234          |
| Các bước thực hiện  | 1. Để trống email.<br>2. Nhập các thông tin khác hợp lệ.<br>3. Click "Create Account". |
| Kết quả mong muốn   | Hiển thị lỗi "Email is required", form validation fail.                                |
| Kết quả thực tế     |   Nút "Create Accunt" không thể ấn do bỏ trống field.                                                                                     |

---

#### 6. Password Too Short

| **Tiêu chí**        | **Nội dung**                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu ngắn hơn 8 ký tự.                                                    |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: Test@1<br>Confirm: Test@1              |
| Các bước thực hiện  | 1. Nhập mật khẩu 7 ký tự.<br>2. Kiểm tra password requirements.<br>3. Click "Create Account". |
| Kết quả mong muốn   | Password requirements hiển thị length requirement không đạt, nút Create Account disable.      |
| Kết quả thực tế     | Ký tự trong mật khẩu được kiểm tra real-time cho đến khi ký tự trong mật khẩu được đúng yêu cầu.                                                                                              |

---

#### 7. Password Missing Uppercase

| **Tiêu chí**        | **Nội dung**                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu không có chữ hoa.                                             |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: test@1234<br>Confirm: test@1234 |
| Các bước thực hiện  | 1. Nhập mật khẩu toàn chữ thường.<br>2. Kiểm tra password requirements indicator.      |
| Kết quả mong muốn   | Uppercase requirement hiển thị chưa đạt (màu đỏ), form không thể submit.               |
| Kết quả thực tế     |  Hiển thị thông báo lỗi real-time bên dưới field nhập mật khẩu.                                                                                      |

---

#### 8. Password Missing Lowercase

| **Tiêu chí**        | **Nội dung**                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu không có chữ thường.                                          |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: TEST@1234<br>Confirm: TEST@1234 |
| Các bước thực hiện  | 1. Nhập mật khẩu toàn chữ hoa.<br>2. Kiểm tra password requirements indicator.         |
| Kết quả mong muốn   | Lowercase requirement hiển thị chưa đạt, form validation fail.                         |
| Kết quả thực tế     | Hiển thị thông báo lỗi real-time bên dưới field nhập mật khẩu.                                                                                       |

---

#### 9. Password Missing Number

| **Tiêu chí**        | **Nội dung**                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu không có số.                                                |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: Test@abc<br>Confirm: Test@abc |
| Các bước thực hiện  | 1. Nhập mật khẩu không chứa số.<br>2. Kiểm tra password requirements.                |
| Kết quả mong muốn   | Number requirement không đạt, nút Create Account bị disable.                         |
| Kết quả thực tế     |  Hiển thị thông báo lỗi real-time bên dưới field nhập mật khẩu.                                                                                    |

---

#### 10. Password Missing Special Character

| **Tiêu chí**        | **Nội dung**                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu không có ký tự đặc biệt.                                    |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: Test1234<br>Confirm: Test1234 |
| Các bước thực hiện  | 1. Nhập mật khẩu không có special character.<br>2. Check password requirements.      |
| Kết quả mong muốn   | Special character requirement không đạt, form không thể submit.                      |
| Kết quả thực tế     | Hiển thị thông báo lỗi real-time bên dưới field nhập mật khẩu.                                                                                     |

---

#### 11. Password Mismatch

| **Tiêu chí**        | **Nội dung**                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu xác nhận không khớp.                                                   |
| Dữ liệu đầu vào mẫu | Name: John Doe<br>Email: john@example.com<br>Password: Test@1234<br>Confirm: Test@12345         |
| Các bước thực hiện  | 1. Nhập password và confirm password khác nhau.<br>2. Kiểm tra PasswordMatchIndicator.          |
| Kết quả mong muốn   | Hiển thị "Passwords do not match", password match indicator màu đỏ, nút Create Account disable. |
| Kết quả thực tế     | Hiển thị thông báo không khớp real-time bên dưới field nhập xác nhận mật khẩu.                                                                                                |

---

#### 12. Password Requirements Real-time Check

| **Tiêu chí**        | **Nội dung**                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập mật khẩu và xem real-time validation.                                          |
| Dữ liệu đầu vào mẫu | Từng bước nhập: "t" → "te" → "Test" → "Test1" → "Test@1" → "Test@123"                          |
| Các bước thực hiện  | 1. Nhập từng ký tự của mật khẩu.<br>2. Quan sát thay đổi của password requirements indicators. |
| Kết quả mong muốn   | Các requirement check thay đổi real-time: length, uppercase, lowercase, number, special.       |
| Kết quả thực tế     | Các yêu cầu lần lượt chuyển từ đỏ sang xanh xác nhận mật khẩu đạt yêu cầu.                                                                                               |

---

#### 13. Password Match Indicator

| **Tiêu chí**        | **Nội dung**                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng nhập confirm password và xem match indicator.                                  |
| Dữ liệu đầu vào mẫu | Password: Test@1234<br>Confirm từng bước: "T" → "Te" → "Test@1234"                        |
| Các bước thực hiện  | 1. Nhập password trước.<br>2. Nhập confirm password từng ký tự.<br>3. Quan sát indicator. |
| Kết quả mong muốn   | Match indicator thay đổi màu: đỏ khi không khớp, xanh khi khớp hoàn toàn.                 |
| Kết quả thực tế     |  Do not match cho tới khi xác nhận mật khẩu khớp với mật khẩu nhập phía trên.                                                                                         |

---

#### 14. Form Validation Error Clear

| **Tiêu chí**        | **Nội dung**                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng fix lỗi validation và kiểm tra error message biến mất.                               |
| Dữ liệu đầu vào mẫu | Bắt đầu với invalid data, sau đó fix thành valid                                                |
| Các bước thực hiện  | 1. Submit form với lỗi để hiển thị error.<br>2. Fix từng field.<br>3. Kiểm tra error clear.     |
| Kết quả mong muốn   | Error message biến mất khi user bắt đầu nhập lại đúng, field border đổi từ đỏ sang bình thường. |
| Kết quả thực tế     |  Error message biến mất khi user bắt đầu nhập lại đúng, field border đổi từ đỏ sang bình thường.                                                                                               |

---

#### 15. Create Account Button States

| **Tiêu chí**        | **Nội dung**                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Kiểm tra trạng thái của nút Create Account trong các tình huống.                                              |
| Dữ liệu đầu vào mẫu | Các trường hợp: empty fields, invalid data, valid data                                                        |
| Các bước thực hiện  | 1. Test button disabled khi form invalid.<br>2. Test button enabled khi form valid.<br>3. Test loading state. |
| Kết quả mong muốn   | Button disable khi form invalid, enable khi valid, hiển thị spinner và "Creating Account..." khi submit.      |
| Kết quả thực tế     |   Button disable khi form invalid, enable khi valid, hiển thị spinner và "Creating Account..." khi submit.                                                                                                            |

---

#### 16. Google Login Button

| **Tiêu chí**        | **Nội dung**                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng click vào nút "Sign up with Google".                                            |
| Dữ liệu đầu vào mẫu | Click Google login button                                                                  |
| Các bước thực hiện  | 1. Click nút Google login.<br>2. Kiểm tra loading state.<br>3. Kiểm tra Google OAuth flow. |
| Kết quả mong muốn   | Button hiển thị loading state, trigger Google OAuth process.                               |
| Kết quả thực tế     |  Button chưa được handle, chỉ có trạng tháng loading khi ấn.                                                                                          |

---

#### 17. Registration API Success

| **Tiêu chí**        | **Nội dung**                                                                |
| ------------------- | --------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Backend API trả về response thành công.                                     |
| Dữ liệu đầu vào mẫu | Valid registration data, API returns 200/201                                |
| Các bước thực hiện  | 1. Submit valid form.<br>2. API call successful.<br>3. Kiểm tra navigation. |
| Kết quả mong muốn   | Navigate đến `/verify-email?email=user@example.com`, không có error alert.  |
| Kết quả thực tế     |  Navigate đến /verify-email?email=user@example.com, không có error alert.                                                                           |

---

#### 18. Registration API Error - Email Exists

| **Tiêu chí**        | **Nội dung**                                                                       |
| ------------------- | ---------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Backend API trả về lỗi email đã tồn tại.                                           |
| Dữ liệu đầu vào mẫu | Email đã được đăng ký trước đó                                                     |
| Các bước thực hiện  | 1. Submit form với email đã tồn tại.<br>2. API returns 400 "Email already exists". |
| Kết quả mong muốn   | Hiển thị alert "Registration failed: Email already exists", không navigate.        |
| Kết quả thực tế     |    Chưa hiển thị đúng thông báo lỗi đã tồn tại email từ backend.                                                                                |

---

#### 19. Registration API Network Error

| **Tiêu chí**        | **Nội dung**                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Network error xảy ra khi gọi API đăng ký.                                                   |
| Dữ liệu đầu vào mẫu | Valid form data, network connection issues                                                  |
| Các bước thực hiện  | 1. Ngắt mạng hoặc simulate network error.<br>2. Submit form.<br>3. Kiểm tra error handling. |
| Kết quả mong muốn   | Hiển thị alert "An unexpected error occurred. Please try again.", loading state kết thúc.   |
| Kết quả thực tế     |                                                                                             |

---

#### 20. Terms and Privacy Links

| **Tiêu chí**        | **Nội dung**                                                                          |
| ------------------- | ------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào links Terms of Service và Privacy Policy.                        |
| Dữ liệu đầu vào mẫu | Click vào các links ở cuối form                                                       |
| Các bước thực hiện  | 1. Click "Terms of Service".<br>2. Click "Privacy Policy".<br>3. Kiểm tra navigation. |
| Kết quả mong muốn   | Navigate đến /terms và /privacy pages tương ứng.                                      |
| Kết quả thực tế     |     Chưa có terms và privacy page.                                                                                  |

---

#### 21. Login Link Navigation

| **Tiêu chí**        | **Nội dung**                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng đã có account và muốn đăng nhập.                                       |
| Dữ liệu đầu vào mẫu | Click "Sign in" link ở cuối trang                                                 |
| Các bước thực hiện  | 1. Scroll xuống cuối form.<br>2. Click "Sign in" link.<br>3. Kiểm tra navigation. |
| Kết quả mong muốn   | Navigate đến trang /login.                                                        |
| Kết quả thực tế     | Navigation đúng tới trang login.                                                                                  |

---

#### 22. Email Verification Success Flow

| **Tiêu chí**        | **Nội dung**                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng click vào link verify email thành công.                                         |
| Dữ liệu đầu vào mẫu | Valid verification token trong URL                                                         |
| Các bước thực hiện  | 1. Click email verification link.<br>2. Kiểm tra verify-success page.<br>3. Auto redirect. |
| Kết quả mong muốn   | Hiển thị success message, countdown 5s, auto redirect đến /login.                          |
| Kết quả thực tế     |   Countdown và navigate sang trang login đúng.                                                                                         |

---

#### 23. Email Verification Expired Token

| **Tiêu chí**        | **Nội dung**                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào link verify email đã hết hạn.                                          |
| Dữ liệu đầu vào mẫu | Token = "expired" trong URL                                                                 |
| Các bước thực hiện  | 1. Access verify link với expired token.<br>2. Kiểm tra error state.                        |
| Kết quả mong muốn   | Hiển thị "Verification Link Expired", button "Request New Verification" và "Back to Login". |
| Kết quả thực tế     |   Chưa handle trường hợp này.                                                                                          |

---

#### 24. Email Verification Invalid Token

| **Tiêu chí**        | **Nội dung**                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào link verify email với token không hợp lệ.                         |
| Dữ liệu đầu vào mẫu | Token = "invalid" hoặc malformed token                                                 |
| Các bước thực hiện  | 1. Access verify link với invalid token.<br>2. Kiểm tra error handling.                |
| Kết quả mong muốn   | Hiển thị "Verification Failed", buttons "Try Registration Again" và "Contact Support". |
| Kết quả thực tế     |   Chỉ hiển thị alert thông báo lỗi.                                                                                     |

---

#### 25. Responsive Design - Mobile Layout

| **Tiêu chí**        | **Nội dung**                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng truy cập trang đăng ký trên mobile device.                                               |
| Dữ liệu đầu vào mẫu | Screen width < 640px                                                                                |
| Các bước thực hiện  | 1. Resize browser xuống mobile size.<br>2. Kiểm tra layout responsive.<br>3. Test form interaction. |
| Kết quả mong muốn   | Form responsive đúng, width 100% trên mobile, spacing phù hợp, buttons full-width.                  |
| Kết quả thực tế     |   Responsive tốt đối với các kích thước màn hình khác nhau.                                                                                                  |
