# Báo Cáo Kiểm Thử - Chức Năng Hồ Sơ Người Dùng

**Ngày cập nhật**: 12/03/2026  
**Module**: Quản lý người dùng - Hồ sơ & Cài đặt tài khoản  
**Phiên bản**: 2.0  
**Tổng số test case**: 12

---

## Mục lục

1. [TC-UP-001: Xem thông tin hồ sơ cá nhân](#tc-up-001)
2. [TC-UP-002: Cập nhật tên hiển thị thành công](#tc-up-002)
3. [TC-UP-003: Cập nhật email thành công](#tc-up-003)
4. [TC-UP-004: Cập nhật email trùng với người dùng khác](#tc-up-004)
5. [TC-UP-005: Cập nhật với tên để trống](#tc-up-005)
6. [TC-UP-006: Cập nhật email sai định dạng](#tc-up-006)
7. [TC-UP-007: Xóa tài khoản thành công](#tc-up-007)
8. [TC-UP-008: Hủy xóa tài khoản trong dialog xác nhận](#tc-up-008)
9. [TC-UP-009: Kiểm tra cài đặt quyền riêng tư](#tc-up-009)
10. [TC-UP-010: Xem hồ sơ khi chưa đăng nhập](#tc-up-010)
11. [TC-UP-011: Cập nhật tên với ký tự đặc biệt](#tc-up-011)
12. [TC-UP-012: Kiểm tra hiển thị thông tin sau cập nhật](#tc-up-012)

---

### TC-UP-001: Xem thông tin hồ sơ cá nhân {#tc-up-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem thông tin hồ sơ cá nhân trên trang cài đặt |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Tài khoản: tên `Nguyễn Văn A`, email `user@example.com` |
| **Các bước thực hiện** | 1. Truy cập trang cài đặt tài khoản (`/dashboard/accountsetting`)<br>2. Quan sát phần "Hồ sơ người dùng" |
| **Dữ liệu test** | API: `GET /api/v1/user/me` |
| **Kết quả mong đợi** | - Hiển thị tên: `Nguyễn Văn A`<br>- Hiển thị email: `user@example.com`<br>- Các trường ở trạng thái xem (read-only) hoặc có nút "Chỉnh sửa" |

---

### TC-UP-002: Cập nhật tên hiển thị thành công {#tc-up-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thay đổi tên hiển thị của người dùng |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang cài đặt tài khoản (`/dashboard/accountsetting`) |
| **Các bước thực hiện** | 1. Nhấn nút "Chỉnh sửa" hoặc trực tiếp sửa trường "Tên"<br>2. Xóa tên cũ, nhập tên mới<br>3. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Tên cũ: `Nguyễn Văn A`<br>Tên mới: `Trần Thị B`<br>API: `PUT /api/v1/user/me` body: `{"name": "Trần Thị B"}` |
| **Kết quả mong đợi** | - Tên được cập nhật thành công<br>- Hiển thị thông báo "Cập nhật thành công"<br>- Header/sidebar hiển thị tên mới<br>- Trang được revalidate với dữ liệu mới |

---

### TC-UP-003: Cập nhật email thành công {#tc-up-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thay đổi email của người dùng |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang cài đặt tài khoản |
| **Các bước thực hiện** | 1. Sửa trường "Email" với email mới<br>2. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Email cũ: `user@example.com`<br>Email mới: `newemail@example.com`<br>API: `PUT /api/v1/user/me` body: `{"email": "newemail@example.com"}` |
| **Kết quả mong đợi** | - Email được cập nhật thành công<br>- Hiển thị thông báo "Cập nhật thành công"<br>- API trả về 200 với dữ liệu mới |

---

### TC-UP-004: Cập nhật email trùng với người dùng khác {#tc-up-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Cập nhật email đã được sử dụng bởi tài khoản khác |
| **Điều kiện tiên quyết** | - Email `existing@example.com` đã tồn tại cho người dùng khác<br>- Người dùng đã đăng nhập và đang ở trang cài đặt |
| **Các bước thực hiện** | 1. Sửa trường "Email" thành email đã tồn tại<br>2. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Email mới: `existing@example.com` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email đã được sử dụng"<br>- Email không bị thay đổi<br>- API trả về lỗi 400/409 |

---

### TC-UP-005: Cập nhật với tên để trống {#tc-up-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Cập nhật hồ sơ khi xóa hết tên và lưu |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập và đang ở trang cài đặt |
| **Các bước thực hiện** | 1. Xóa toàn bộ nội dung trường "Tên"<br>2. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Tên: *(để trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Tên không được để trống"<br>- Tên không bị cập nhật<br>- Form validation ngăn submit |

---

### TC-UP-006: Cập nhật email sai định dạng {#tc-up-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Cập nhật email với format không hợp lệ |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập và đang ở trang cài đặt |
| **Các bước thực hiện** | 1. Sửa trường "Email" thành email sai format<br>2. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Email: `invalidemail.com` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Email không đúng định dạng"<br>- Email không bị cập nhật |

---

### TC-UP-007: Xóa tài khoản thành công {#tc-up-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xóa tài khoản vĩnh viễn sau khi xác nhận |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang cài đặt tài khoản, phần "Vùng nguy hiểm" |
| **Các bước thực hiện** | 1. Cuộn xuống phần "Xóa tài khoản" (Danger Zone)<br>2. Nhấn nút "Xóa tài khoản"<br>3. Dialog xác nhận hiện lên<br>4. Nhấn "Xác nhận xóa" trong dialog |
| **Dữ liệu test** | API: `DELETE /api/v1/user/me` |
| **Kết quả mong đợi** | - Tài khoản bị xóa (cascade xóa token liên quan)<br>- Cookie xác thực bị xóa<br>- Chuyển hướng đến trang đăng nhập<br>- Không thể đăng nhập lại với email cũ |

---

### TC-UP-008: Hủy xóa tài khoản trong dialog xác nhận {#tc-up-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hủy thao tác xóa tài khoản khi dialog xác nhận hiện lên |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập, đang ở trang cài đặt |
| **Các bước thực hiện** | 1. Nhấn nút "Xóa tài khoản"<br>2. Dialog xác nhận hiện lên<br>3. Nhấn "Hủy" hoặc đóng dialog |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Dialog đóng lại<br>- Tài khoản vẫn tồn tại<br>- Người dùng vẫn đăng nhập bình thường<br>- Không gọi API xóa |

---

### TC-UP-009: Kiểm tra cài đặt quyền riêng tư {#tc-up-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra phần cài đặt quyền riêng tư/hiển thị |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang cài đặt tài khoản |
| **Các bước thực hiện** | 1. Tìm phần "Cài đặt hiển thị" (Visibility Settings)<br>2. Bật/tắt các tùy chọn quyền riêng tư<br>3. Lưu thay đổi |
| **Dữ liệu test** | Toggle: Hiển thị email công khai: ON → OFF |
| **Kết quả mong đợi** | - Các tùy chọn hiển thị đúng trạng thái hiện tại<br>- Thay đổi được lưu thành công<br>- Phản ánh đúng khi xem từ ngoài |

---

### TC-UP-010: Xem hồ sơ khi chưa đăng nhập {#tc-up-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập trang cài đặt tài khoản khi chưa đăng nhập |
| **Điều kiện tiên quyết** | - Người dùng chưa đăng nhập (không có token) |
| **Các bước thực hiện** | 1. Truy cập trực tiếp URL `/dashboard/accountsetting`<br>2. Quan sát phản hồi |
| **Dữ liệu test** | URL: `/dashboard/accountsetting` |
| **Kết quả mong đợi** | - Middleware chặn truy cập<br>- Chuyển hướng đến trang đăng nhập (`/login`)<br>- Không hiển thị thông tin tài khoản |

---

### TC-UP-011: Cập nhật tên với ký tự đặc biệt {#tc-up-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Cập nhật tên chứa ký tự đặc biệt và emoji |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập và đang ở trang cài đặt |
| **Các bước thực hiện** | 1. Sửa trường "Tên" thành tên có ký tự đặc biệt<br>2. Nhấn nút "Lưu thay đổi" |
| **Dữ liệu test** | Tên mới: `<script>alert(1)</script>` |
| **Kết quả mong đợi** | - Tên được sanitize an toàn<br>- Không thực thi mã JavaScript<br>- Cập nhật thành công hoặc thông báo tên không hợp lệ |

---

### TC-UP-012: Kiểm tra hiển thị thông tin sau cập nhật {#tc-up-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác minh thông tin mới hiển thị đúng trên toàn hệ thống |
| **Điều kiện tiên quyết** | - Vừa cập nhật tên thành `Tên Mới` thành công |
| **Các bước thực hiện** | 1. Sau khi cập nhật tên thành công, kiểm tra header (sidebar/navigation)<br>2. Chuyển đến trang dashboard<br>3. Quay lại trang cài đặt<br>4. Kiểm tra tên hiển thị nhất quán |
| **Dữ liệu test** | Tên mới: `Tên Mới` |
| **Kết quả mong đợi** | - Tên mới hiển thị đúng trên header/sidebar<br>- Tên mới hiển thị đúng trên trang cài đặt<br>- Trang được revalidate — không cần refresh thủ công |
