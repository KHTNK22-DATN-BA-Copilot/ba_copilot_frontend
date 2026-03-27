# Báo Cáo Kiểm Thử - Chức Năng Đăng Xuất

**Ngày cập nhật**: 12/03/2026  
**Module**: Xác thực người dùng - Đăng xuất  
**Phiên bản**: 2.0  
**Tổng số test case**: 6

---

## Mục lục

1. [TC-LO-001: Đăng xuất thành công](#tc-lo-001)
2. [TC-LO-002: Kiểm tra xóa token sau đăng xuất](#tc-lo-002)
3. [TC-LO-003: Truy cập trang bảo vệ sau đăng xuất](#tc-lo-003)
4. [TC-LO-004: Nhấn nút Back sau đăng xuất](#tc-lo-004)
5. [TC-LO-005: Đăng xuất khi token đã hết hạn](#tc-lo-005)
6. [TC-LO-006: Đăng xuất từ nhiều tab cùng lúc](#tc-lo-006)

---

### TC-LO-001: Đăng xuất thành công {#tc-lo-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đăng xuất khỏi hệ thống thành công |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập thành công<br>- Đang ở trang dashboard hoặc bất kỳ trang nào trong hệ thống |
| **Các bước thực hiện** | 1. Tìm và nhấn vào menu người dùng (avatar/tên) trên header<br>2. Nhấn nút "Đăng xuất" trong dropdown menu |
| **Dữ liệu test** | Tài khoản đã đăng nhập: `user@example.com` |
| **Kết quả mong đợi** | - Đăng xuất thành công<br>- Chuyển hướng đến trang đăng nhập (`/login`)<br>- Access token và refresh token được xóa khỏi cookie<br>- Backend vô hiệu hóa refresh token trong database |

---

### TC-LO-002: Kiểm tra xóa token sau đăng xuất {#tc-lo-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác minh cookie và token bị xóa hoàn toàn sau đăng xuất |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang trong hệ thống |
| **Các bước thực hiện** | 1. Mở DevTools (F12) → tab Application → Cookies<br>2. Kiểm tra access_token và refresh_token tồn tại<br>3. Thực hiện đăng xuất<br>4. Kiểm tra lại Cookies trong DevTools |
| **Dữ liệu test** | Tài khoản đã đăng nhập: `user@example.com` |
| **Kết quả mong đợi** | - Trước đăng xuất: cookie access_token và refresh_token tồn tại<br>- Sau đăng xuất: cả hai cookie đều bị xóa<br>- Không còn thông tin xác thực nào trong browser |

---

### TC-LO-003: Truy cập trang bảo vệ sau đăng xuất {#tc-lo-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập trang yêu cầu đăng nhập sau khi đã đăng xuất |
| **Điều kiện tiên quyết** | - Người dùng đã đăng xuất thành công<br>- Đang ở trang đăng nhập |
| **Các bước thực hiện** | 1. Gõ trực tiếp URL `/dashboard` vào thanh địa chỉ<br>2. Nhấn Enter<br>3. Quan sát phản hồi hệ thống |
| **Dữ liệu test** | URL: `http://localhost:3000/dashboard` |
| **Kết quả mong đợi** | - Middleware phát hiện không có token hợp lệ<br>- Chuyển hướng tự động về trang đăng nhập (`/login`)<br>- Không hiển thị nội dung dashboard |

---

### TC-LO-004: Nhấn nút Back sau đăng xuất {#tc-lo-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhấn nút quay lại trình duyệt sau khi đăng xuất |
| **Điều kiện tiên quyết** | - Người dùng vừa đăng xuất thành công<br>- Đang ở trang đăng nhập |
| **Các bước thực hiện** | 1. Sau khi đăng xuất, nhấn nút Back (←) trên trình duyệt<br>2. Quan sát trang hiển thị |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Không hiển thị trang dashboard (trang trước đó)<br>- Chuyển hướng về trang đăng nhập<br>- Cache trang bảo vệ không bị hiển thị |

---

### TC-LO-005: Đăng xuất khi token đã hết hạn {#tc-lo-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thực hiện đăng xuất khi access token đã hết hạn |
| **Điều kiện tiên quyết** | - Người dùng đăng nhập nhưng access token đã hết hạn (sau 30 phút không refresh)<br>- Refresh token vẫn còn hạn |
| **Các bước thực hiện** | 1. Chờ access token hết hạn (hoặc xóa thủ công qua DevTools)<br>2. Nhấn nút "Đăng xuất" |
| **Dữ liệu test** | Access token: *(đã hết hạn)*<br>Refresh token: *(còn hạn)* |
| **Kết quả mong đợi** | - Đăng xuất vẫn thực hiện được<br>- Refresh token bị vô hiệu hóa trên server<br>- Chuyển hướng về trang đăng nhập<br>- Không hiển thị lỗi |

---

### TC-LO-006: Đăng xuất từ nhiều tab cùng lúc {#tc-lo-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hành vi khi đăng xuất ở 1 tab và kiểm tra tab khác |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Mở 2 tab cùng ứng dụng (cả 2 đều ở dashboard) |
| **Các bước thực hiện** | 1. Tab 1: Đang ở `/dashboard`<br>2. Tab 2: Đang ở `/dashboard/project/1`<br>3. Đăng xuất trên Tab 1<br>4. Quay lại Tab 2 và thực hiện thao tác (ví dụ: nhấn nút) |
| **Dữ liệu test** | Tài khoản đã đăng nhập: `user@example.com` |
| **Kết quả mong đợi** | - Tab 1: Đăng xuất thành công, chuyển về trang đăng nhập<br>- Tab 2: Khi thực hiện thao tác tiếp, API trả về lỗi 401<br>- Tab 2 chuyển hướng về trang đăng nhập |
