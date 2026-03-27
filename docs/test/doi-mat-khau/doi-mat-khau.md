# Báo Cáo Kiểm Thử - Chức Năng Đổi Mật Khẩu

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Đổi mật khẩu  
**Phiên bản**: 2.0  
**Tổng số test case**: 8

---

## Mục lục

1. [TC-CP-001: Đổi mật khẩu thành công](#tc-cp-001)
2. [TC-CP-002: Đổi mật khẩu với mật khẩu cũ sai](#tc-cp-002)
3. [TC-CP-003: Đổi mật khẩu mới quá yếu](#tc-cp-003)
4. [TC-CP-004: Đổi mật khẩu mới trùng với mật khẩu cũ](#tc-cp-004)
5. [TC-CP-005: Xác nhận mật khẩu mới không khớp](#tc-cp-005)
6. [TC-CP-006: Đổi mật khẩu khi để trống các trường](#tc-cp-006)
7. [TC-CP-007: Đăng nhập lại với mật khẩu mới sau khi đổi](#tc-cp-007)
8. [TC-CP-008: Đổi mật khẩu khi chưa đăng nhập](#tc-cp-008)

---

### TC-CP-001: Đổi mật khẩu thành công {#tc-cp-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu thành công với thông tin hợp lệ |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Mật khẩu hiện tại: `OldPassword@123`<br>- Đang ở trang cài đặt tài khoản hoặc trang đổi mật khẩu |
| **Các bước thực hiện** | 1. Nhập mật khẩu hiện tại vào trường "Mật khẩu cũ"<br>2. Nhập mật khẩu mới vào trường "Mật khẩu mới"<br>3. Nhập xác nhận mật khẩu mới<br>4. Nhấn nút "Đổi mật khẩu" |
| **Dữ liệu test** | Mật khẩu cũ: `OldPassword@123`<br>Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `NewPassword@456` |
| **Kết quả mong đợi** | - Mật khẩu được cập nhật thành công trong database<br>- Hiển thị thông báo "Đổi mật khẩu thành công"<br>- API `POST /api/v1/auth/change-password` trả về 200 |

---

### TC-CP-002: Đổi mật khẩu với mật khẩu cũ sai {#tc-cp-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu khi nhập sai mật khẩu hiện tại |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Mật khẩu thật: `OldPassword@123` |
| **Các bước thực hiện** | 1. Nhập mật khẩu cũ sai vào trường "Mật khẩu cũ"<br>2. Nhập mật khẩu mới hợp lệ<br>3. Nhập xác nhận mật khẩu mới<br>4. Nhấn nút "Đổi mật khẩu" |
| **Dữ liệu test** | Mật khẩu cũ: `WrongOldPass@999`<br>Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `NewPassword@456` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu cũ không đúng"<br>- Mật khẩu không bị thay đổi<br>- API trả về lỗi 400/401 |

---

### TC-CP-003: Đổi mật khẩu mới quá yếu {#tc-cp-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu mới không đủ tiêu chuẩn bảo mật |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập |
| **Các bước thực hiện** | 1. Nhập mật khẩu cũ đúng<br>2. Nhập mật khẩu mới quá đơn giản<br>3. Xác nhận mật khẩu mới<br>4. Nhấn nút "Đổi mật khẩu" |
| **Dữ liệu test** | Mật khẩu cũ: `OldPassword@123`<br>Mật khẩu mới: `123`<br>Xác nhận: `123` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi yêu cầu mật khẩu đủ mạnh<br>- Mật khẩu không bị thay đổi |

---

### TC-CP-004: Đổi mật khẩu mới trùng với mật khẩu cũ {#tc-cp-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu mới giống hệt mật khẩu hiện tại |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Mật khẩu hiện tại: `OldPassword@123` |
| **Các bước thực hiện** | 1. Nhập mật khẩu cũ đúng<br>2. Nhập mật khẩu mới giống mật khẩu cũ<br>3. Xác nhận mật khẩu mới<br>4. Nhấn nút "Đổi mật khẩu" |
| **Dữ liệu test** | Mật khẩu cũ: `OldPassword@123`<br>Mật khẩu mới: `OldPassword@123`<br>Xác nhận: `OldPassword@123` |
| **Kết quả mong đợi** | - Hiển thị thông báo "Mật khẩu mới không được trùng với mật khẩu cũ"<br>- Hoặc thay đổi thành công (tùy business rule)<br>- Mật khẩu không bị thay đổi nếu hệ thống kiểm tra trùng |

---

### TC-CP-005: Xác nhận mật khẩu mới không khớp {#tc-cp-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu khi trường xác nhận không giống mật khẩu mới |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập |
| **Các bước thực hiện** | 1. Nhập mật khẩu cũ đúng<br>2. Nhập mật khẩu mới<br>3. Nhập xác nhận mật khẩu khác với mật khẩu mới<br>4. Nhấn nút "Đổi mật khẩu" |
| **Dữ liệu test** | Mật khẩu cũ: `OldPassword@123`<br>Mật khẩu mới: `NewPassword@456`<br>Xác nhận: `DifferentPass@789` |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi "Mật khẩu xác nhận không khớp"<br>- Mật khẩu không bị thay đổi |

---

### TC-CP-006: Đổi mật khẩu khi để trống các trường {#tc-cp-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi mật khẩu khi một hoặc nhiều trường bị bỏ trống |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập |
| **Các bước thực hiện** | 1. Để trống trường "Mật khẩu cũ"<br>2. Nhập mật khẩu mới hợp lệ<br>3. Nhấn nút "Đổi mật khẩu"<br>4. Lặp lại với trường "Mật khẩu mới" bỏ trống<br>5. Lặp lại với tất cả trường bỏ trống |
| **Dữ liệu test** | Trường hợp 1: Mật khẩu cũ: *(trống)*, Mới: `NewPass@123`, Xác nhận: `NewPass@123`<br>Trường hợp 2: Cũ: `OldPass@123`, Mới: *(trống)*, Xác nhận: *(trống)*<br>Trường hợp 3: Tất cả *(trống)* |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi cho từng trường bắt buộc bị bỏ trống<br>- Mật khẩu không bị thay đổi<br>- Form validation hiển thị rõ ràng |

---

### TC-CP-007: Đăng nhập lại với mật khẩu mới sau khi đổi {#tc-cp-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra mật khẩu mới hoạt động sau khi đổi thành công |
| **Điều kiện tiên quyết** | - Đã đổi mật khẩu thành công từ `OldPassword@123` sang `NewPassword@456` |
| **Các bước thực hiện** | 1. Đăng xuất khỏi hệ thống<br>2. Thử đăng nhập với mật khẩu cũ `OldPassword@123`<br>3. Quan sát kết quả<br>4. Đăng nhập với mật khẩu mới `NewPassword@456`<br>5. Quan sát kết quả |
| **Dữ liệu test** | Email: `user@example.com`<br>Mật khẩu cũ: `OldPassword@123`<br>Mật khẩu mới: `NewPassword@456` |
| **Kết quả mong đợi** | - Bước 2-3: Đăng nhập với mật khẩu cũ thất bại<br>- Bước 4-5: Đăng nhập với mật khẩu mới thành công<br>- Chuyển hướng đến dashboard |

---

### TC-CP-008: Đổi mật khẩu khi chưa đăng nhập {#tc-cp-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gọi API đổi mật khẩu mà không có token xác thực |
| **Điều kiện tiên quyết** | - Người dùng chưa đăng nhập hoặc token đã hết hạn |
| **Các bước thực hiện** | 1. Gọi trực tiếp API `POST /api/v1/auth/change-password` không kèm access token<br>2. Quan sát phản hồi |
| **Dữ liệu test** | Header: không có Authorization<br>Body: `{"old_password": "OldPass@123", "new_password": "NewPass@456"}` |
| **Kết quả mong đợi** | - API trả về lỗi 401 Unauthorized<br>- Không thay đổi mật khẩu<br>- Thông báo "Không có quyền truy cập" |
