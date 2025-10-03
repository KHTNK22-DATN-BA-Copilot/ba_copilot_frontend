# Test Case — User Profile (Account Settings)

Dưới đây là các test case kiểm thử giao diện và chức năng của User Profile. Mỗi test case gồm tiêu đề và bảng chi tiết các tiêu chí.

---

## TC-01 — Hiển thị thông tin hồ sơ

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | User đã đăng nhập, truy cập trang Account Settings.                                                |
| Dữ liệu mẫu      | name="Nguyen Van A", email="a@example.com"                                                         |
| Các bước thực hiện | 1) Đăng nhập<br>2) Mở /dashboard/accountsetting                                                  |
| Kết quả mong đợi | Hiển thị avatar, tên, email đúng; không có input chỉnh sửa.                                       |
| Kết quả thực tế  |                                                                                                   |

---

## TC-02 — Chuyển sang chế độ chỉnh sửa

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Đang ở view mode.                                                                                 |
| Dữ liệu mẫu      | Như TC-01                                                                                         |
| Các bước thực hiện | 1) Click nút Edit                                                                               |
| Kết quả mong đợi | Hiển thị input cho Full Name, Email; xuất hiện nút Save, Cancel.                                  |
| Kết quả thực tế  |                                                                                                   |

---

## TC-03 — Hủy chỉnh sửa

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Đang ở edit mode, đã thay đổi giá trị.                                                            |
| Dữ liệu mẫu      | fullName="Nguyen Van B", email="b@example.com"                                                    |
| Các bước thực hiện | 1) Sửa giá trị<br>2) Click Cancel                                                               |
| Kết quả mong đợi | Quay về view mode, giá trị gốc được hiển thị, không gọi API.                                      |
| Kết quả thực tế  |                                                                                                   |

---

## TC-04 — Nút Save bị disable khi không thay đổi

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Ở edit mode, chưa sửa gì.                                                                         |
| Dữ liệu mẫu      | Không thay đổi profile                                                                            |
| Các bước thực hiện | 1) Click Edit<br>2) Quan sát nút Save                                                           |
| Kết quả mong đợi | Nút Save bị disable, không gửi request khi click.                                                 |
| Kết quả thực tế  |                                                                                                   |

---

## TC-05 — Validate email không hợp lệ

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Edit mode, nhập email sai định dạng.                                                              |
| Dữ liệu mẫu      | email="invalid-email"                                                                             |
| Các bước thực hiện | 1) Nhập email không hợp lệ<br>2) Click Save                                                      |
| Kết quả mong đợi | Hiển thị lỗi dưới input Email, không gọi API.                                                     |
| Kết quả thực tế  |                                                                                                   |

---

## TC-06 — Đổi email thành công, xác nhận, redirect

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Edit mode, đổi email, server trả 200.                                                             |
| Dữ liệu mẫu      | a@example.com → new@example.com                                                                   |
| Các bước thực hiện | 1) Đổi email<br>2) Click Save<br>3) Xác nhận Alert<br>4) Quan sát redirect                      |
| Kết quả mong đợi | Gọi PUT /api/me, nếu thành công redirect về /login.                                               |
| Kết quả thực tế  |                                                                                                   |

---

## TC-07 — Đổi email, xác nhận, API lỗi

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Như TC-06, server trả lỗi.                                                                        |
| Dữ liệu mẫu      | new email hợp lệ                                                                                  |
| Các bước thực hiện | 1) Đổi email<br>2) Click Save<br>3) Xác nhận<br>4) Mock API trả lỗi                             |
| Kết quả mong đợi | Hiển thị lỗi, không redirect, profile không đổi.                                                  |
| Kết quả thực tế  |                                                                                                   |

---

## TC-08 — Đổi fullName, giữ email, reload

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | Edit fullName, giữ nguyên email, server trả 200.                                                  |
| Dữ liệu mẫu      | fullName "Nguyen Van A" → "Nguyen Van A B"                                                        |
| Các bước thực hiện | 1) Đổi fullName<br>2) Click Save                                                                |
| Kết quả mong đợi | Gọi PUT /api/me, reload trang, UI cập nhật.                                                       |
| Kết quả thực tế  |                                                                                                   |

---

## TC-09 — Upload avatar hợp lệ

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | View mode, click change avatar.                                                                   |
| Dữ liệu mẫu      | test-image.png (hợp lệ, nhỏ hơn giới hạn)                                                          |
| Các bước thực hiện | 1) Click change avatar<br>2) Chọn file<br>3) Quan sát preview và network                        |
| Kết quả mong đợi | Avatar preview cập nhật, gọi API nếu có, không lỗi.                                               |
| Kết quả thực tế  |                                                                                                   |

---

## TC-10 — Upload avatar không hợp lệ/quá lớn

| Tiêu chí         | Nội dung                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------|
| Ngữ cảnh         | View mode, chọn file không hợp lệ/quá lớn.                                                        |
| Dữ liệu mẫu      | file.txt hoặc ảnh > limit                                                                         |
| Các bước thực hiện | 1) Click change avatar<br>2) Chọn file không hợp lệ                                              |
| Kết quả mong đợi | Không cập nhật avatar, hiển thị lỗi, không gọi API.                                               |
| Kết quả thực tế  |                                                                                                   |

