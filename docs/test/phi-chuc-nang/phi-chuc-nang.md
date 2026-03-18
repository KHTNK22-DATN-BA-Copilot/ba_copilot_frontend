# Báo Cáo Kiểm Thử - Phi Chức Năng (Non-Functional)

**Ngày cập nhật**: 12/03/2026  
**Module**: Non-Functional Testing - Kiểm thử phi chức năng  
**Phiên bản**: 2.0  
**Tổng số test case**: 10

---

## Mục lục

1. [TC-NF-001: Token refresh tự động](#tc-nf-001)
2. [TC-NF-002: Bảo vệ route (Route Protection)](#tc-nf-002)
3. [TC-NF-003: Redirect khi token hết hạn](#tc-nf-003)
4. [TC-NF-004: Performance tải trang dashboard](#tc-nf-004)
5. [TC-NF-005: Responsive design trên mobile](#tc-nf-005)
6. [TC-NF-006: Responsive design trên tablet](#tc-nf-006)
7. [TC-NF-007: Bảo mật - XSS Prevention](#tc-nf-007)
8. [TC-NF-008: Bảo mật - SQL Injection Prevention](#tc-nf-008)
9. [TC-NF-009: Bảo mật - CORS Configuration](#tc-nf-009)
10. [TC-NF-010: Đa tab - đồng bộ trạng thái](#tc-nf-010)

---

### TC-NF-001: Token refresh tự động {#tc-nf-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra access token tự động refresh khi gần hết hạn |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Access token sắp hết hạn (30 phút)<br>- Refresh token còn hợp lệ (7 ngày) |
| **Các bước thực hiện** | 1. Đăng nhập và lấy access token<br>2. Chờ đến gần hết hạn access token (hoặc mock thời gian)<br>3. Thực hiện một thao tác yêu cầu API (VD: truy cập dashboard)<br>4. Kiểm tra middleware xử lý |
| **Dữ liệu test** | Access token: hết hạn sau 30 phút<br>Refresh token: hết hạn sau 7 ngày<br>API: `POST /api/v1/auth/refresh-token` |
| **Kết quả mong đợi** | - Middleware phát hiện access token hết hạn<br>- Tự động gọi refresh token API<br>- Nhận access token mới<br>- Cập nhật cookie với token mới<br>- Request ban đầu được thực hiện với token mới<br>- Người dùng không bị gián đoạn |

---

### TC-NF-002: Bảo vệ route (Route Protection) {#tc-nf-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra middleware bảo vệ các protected routes |
| **Điều kiện tiên quyết** | - Chưa đăng nhập (không có token) |
| **Các bước thực hiện** | 1. Truy cập `/dashboard` → kiểm tra redirect<br>2. Truy cập `/dashboard/project/1` → kiểm tra redirect<br>3. Truy cập `/new-project` → kiểm tra redirect<br>4. Truy cập `/login` khi đã đăng nhập → kiểm tra redirect |
| **Dữ liệu test** | Protected routes: `/dashboard`, `/dashboard/*`, `/new-project`<br>Public routes: `/login`, `/register`, `/forgot-password` |
| **Kết quả mong đợi** | - Chưa đăng nhập + protected route → redirect `/login`<br>- Đã đăng nhập + public route (login, register) → redirect `/dashboard`<br>- Middleware chặn mọi truy cập trái phép |

---

### TC-NF-003: Redirect khi token hết hạn {#tc-nf-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra redirect khi cả access token và refresh token đều hết hạn |
| **Điều kiện tiên quyết** | - Access token và refresh token đều đã hết hạn |
| **Các bước thực hiện** | 1. Để token hết hạn (hoặc mock hết hạn)<br>2. Thực hiện bất kỳ thao tác nào<br>3. Kiểm tra xử lý |
| **Dữ liệu test** | Access token: expired<br>Refresh token: expired<br>Refresh API trả về 401 |
| **Kết quả mong đợi** | - Middleware cố refresh → thất bại<br>- Xóa tất cả cookie token<br>- Redirect về `/login`<br>- Hiển thị thông báo phiên hết hạn (nếu có) |

---

### TC-NF-004: Performance tải trang dashboard {#tc-nf-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra thời gian tải trang dashboard |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Tài khoản có 10 dự án |
| **Các bước thực hiện** | 1. Mở DevTools → Network tab<br>2. Truy cập `/dashboard`<br>3. Đo thời gian DOMContentLoaded và Load |
| **Dữ liệu test** | 10 dự án, kết nối internet bình thường |
| **Kết quả mong đợi** | - Thời gian tải trang < 3 giây<br>- First Contentful Paint < 1.5 giây<br>- Không có request API timeout<br>- Dữ liệu dự án hiển thị đầy đủ sau khi load |

---

### TC-NF-005: Responsive design trên mobile {#tc-nf-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra giao diện responsive trên thiết bị mobile |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Mở DevTools → chuyển sang mobile (375x667)<br>2. Kiểm tra trang dashboard<br>3. Kiểm tra trang project overview<br>4. Kiểm tra navigation |
| **Dữ liệu test** | Viewport: 375x667 (iPhone SE) |
| **Kết quả mong đợi** | - Sidebar collapse thành hamburger menu<br>- Content chiếm full width<br>- Font size đọc được<br>- Buttons đủ lớn để tap (min 44x44px)<br>- Không horizontal scroll<br>- Forms sử dụng full width |

---

### TC-NF-006: Responsive design trên tablet {#tc-nf-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra giao diện responsive trên tablet |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Mở DevTools → chuyển sang tablet (768x1024)<br>2. Kiểm tra layout dashboard<br>3. Kiểm tra split view wireframe<br>4. Kiểm tra AI chat panel |
| **Dữ liệu test** | Viewport: 768x1024 (iPad) |
| **Kết quả mong đợi** | - Layout 2 cột hoặc responsive grid<br>- Sidebar có thể hiển thị hoặc collapsible<br>- Wireframe split view hoạt động<br>- Content không bị cắt hoặc chồng lấp |

---

### TC-NF-007: Bảo mật - XSS Prevention {#tc-nf-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hệ thống ngăn chặn Cross-Site Scripting (XSS) |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Nhập script XSS vào tên dự án: `<script>alert('XSS')</script>`<br>2. Nhập vào mô tả: `<img src=x onerror=alert('XSS')>`<br>3. Nhập vào tên người dùng: `"><script>document.cookie</script>`<br>4. Quan sát kết quả hiển thị |
| **Dữ liệu test** | XSS payloads:<br>- `<script>alert('XSS')</script>`<br>- `<img src=x onerror=alert('XSS')>`<br>- `"><script>document.cookie</script>` |
| **Kết quả mong đợi** | - Script KHÔNG được thực thi<br>- Nội dung được escape hoặc sanitize trước khi hiển thị<br>- Hiển thị dưới dạng text thuần, không phải HTML<br>- Không có alert popup |

---

### TC-NF-008: Bảo mật - SQL Injection Prevention {#tc-nf-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hệ thống ngăn chặn SQL Injection |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Nhập vào ô tìm kiếm: `'; DROP TABLE projects; --`<br>2. Nhập vào tên dự án: `' OR '1'='1`<br>3. Quan sát kết quả |
| **Dữ liệu test** | SQL Injection payloads:<br>- `'; DROP TABLE projects; --`<br>- `' OR '1'='1`<br>- `1; SELECT * FROM users` |
| **Kết quả mong đợi** | - Backend sử dụng ORM (SQLAlchemy) với parameterized queries<br>- Không xảy ra SQL injection<br>- Dữ liệu được treat as string bình thường<br>- Database vẫn nguyên vẹn |

---

### TC-NF-009: Bảo mật - CORS Configuration {#tc-nf-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra CORS được cấu hình đúng |
| **Điều kiện tiên quyết** | - Backend server đang chạy |
| **Các bước thực hiện** | 1. Gửi request từ domain khác (VD: http://evil.com) đến API backend<br>2. Kiểm tra CORS headers trong response |
| **Dữ liệu test** | Origin header: `http://evil.com`<br>Preflight request: OPTIONS method |
| **Kết quả mong đợi** | - Chỉ cho phép origin đã cấu hình (localhost, domain chính thức)<br>- Request từ origin không được phép bị từ chối<br>- Không có `Access-Control-Allow-Origin: *` trên production |

---

### TC-NF-010: Đa tab - đồng bộ trạng thái {#tc-nf-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hành vi khi mở ứng dụng trên nhiều tab |
| **Điều kiện tiên quyết** | - Đăng nhập trên tab 1 |
| **Các bước thực hiện** | 1. Mở tab mới → truy cập dashboard (tab 2)<br>2. Đăng xuất trên tab 1<br>3. Quay lại tab 2 và thực hiện thao tác |
| **Dữ liệu test** | 2 tab trình duyệt cùng account |
| **Kết quả mong đợi** | - Tab 2 phát hiện token đã bị xóa khi thực hiện request<br>- Redirect về trang login<br>- Không hiển thị dữ liệu cũ cached<br>- Không gây lỗi ứng dụng |
