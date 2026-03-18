# Báo Cáo Kiểm Thử - Chức Năng Bảng Điều Khiển (Dashboard)

**Ngày cập nhật**: 12/03/2026  
**Module**: Dashboard - Bảng điều khiển chính  
**Phiên bản**: 2.0  
**Tổng số test case**: 10

---

## Mục lục

1. [TC-DB-001: Hiển thị danh sách dự án](#tc-db-001)
2. [TC-DB-002: Hiển thị khi không có dự án nào](#tc-db-002)
3. [TC-DB-003: Tìm kiếm dự án theo tên](#tc-db-003)
4. [TC-DB-004: Lọc dự án theo trạng thái](#tc-db-004)
5. [TC-DB-005: Sắp xếp dự án theo ngày tạo](#tc-db-005)
6. [TC-DB-006: Sắp xếp dự án theo tên](#tc-db-006)
7. [TC-DB-007: Nhấn vào dự án để xem chi tiết](#tc-db-007)
8. [TC-DB-008: Nhấn nút tạo dự án mới](#tc-db-008)
9. [TC-DB-009: Hiển thị layout dashboard đúng](#tc-db-009)
10. [TC-DB-010: Truy cập dashboard khi chưa đăng nhập](#tc-db-010)

---

### TC-DB-001: Hiển thị danh sách dự án {#tc-db-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hiển thị danh sách tất cả dự án của người dùng |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Tài khoản có ít nhất 3 dự án (active) |
| **Các bước thực hiện** | 1. Truy cập trang dashboard (`/dashboard`)<br>2. Quan sát phần danh sách dự án |
| **Dữ liệu test** | API: `GET /api/v1/projects/`<br>Dữ liệu: 3 dự án với status "active" |
| **Kết quả mong đợi** | - Hiển thị đúng số lượng dự án (3 dự án)<br>- Mỗi dự án hiển thị: tên, mô tả, trạng thái, ngày tạo<br>- Không hiển thị dự án có status "deleted" |

---

### TC-DB-002: Hiển thị khi không có dự án nào {#tc-db-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hiển thị trạng thái trống khi người dùng chưa có dự án |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Tài khoản chưa tạo dự án nào |
| **Các bước thực hiện** | 1. Truy cập trang dashboard (`/dashboard`)<br>2. Quan sát phần danh sách dự án |
| **Dữ liệu test** | API trả về danh sách rỗng `[]` |
| **Kết quả mong đợi** | - Hiển thị empty state với thông báo "Chưa có dự án nào"<br>- Có nút/link "Tạo dự án mới" để khuyến khích tạo<br>- Không hiển thị lỗi |

---

### TC-DB-003: Tìm kiếm dự án theo tên {#tc-db-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tìm kiếm dự án theo từ khóa tên |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Có các dự án: "E-Commerce App", "Mobile Banking", "CRM System" |
| **Các bước thực hiện** | 1. Tìm ô tìm kiếm trên trang dashboard<br>2. Nhập từ khóa "Commerce"<br>3. Quan sát kết quả lọc |
| **Dữ liệu test** | Từ khóa: `Commerce` |
| **Kết quả mong đợi** | - Chỉ hiển thị dự án "E-Commerce App"<br>- Các dự án khác bị ẩn<br>- Tìm kiếm case-insensitive |

---

### TC-DB-004: Lọc dự án theo trạng thái {#tc-db-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Lọc dự án theo trạng thái active/completed |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Có dự án với các trạng thái khác nhau (active, completed) |
| **Các bước thực hiện** | 1. Tìm bộ lọc trạng thái trên dashboard<br>2. Chọn lọc "Active"<br>3. Quan sát danh sách<br>4. Chọn lọc "Completed"<br>5. Quan sát danh sách |
| **Dữ liệu test** | 2 dự án active, 1 dự án completed |
| **Kết quả mong đợi** | - Lọc "Active": hiển thị 2 dự án<br>- Lọc "Completed": hiển thị 1 dự án<br>- Số lượng khớp với filter |

---

### TC-DB-005: Sắp xếp dự án theo ngày tạo {#tc-db-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Sắp xếp danh sách dự án theo ngày tạo mới nhất/cũ nhất |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Có ít nhất 3 dự án với ngày tạo khác nhau |
| **Các bước thực hiện** | 1. Tìm tùy chọn sắp xếp trên dashboard<br>2. Chọn "Mới nhất trước"<br>3. Quan sát thứ tự<br>4. Chọn "Cũ nhất trước"<br>5. Quan sát thứ tự |
| **Dữ liệu test** | 3 dự án tạo ngày: 01/01, 15/02, 10/03 |
| **Kết quả mong đợi** | - "Mới nhất": dự án 10/03 hiển thị đầu tiên<br>- "Cũ nhất": dự án 01/01 hiển thị đầu tiên<br>- Thứ tự nhất quán |

---

### TC-DB-006: Sắp xếp dự án theo tên {#tc-db-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Sắp xếp danh sách dự án theo tên A-Z / Z-A |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Có các dự án: "Alpha", "Beta", "Gamma" |
| **Các bước thực hiện** | 1. Chọn sắp xếp "Tên A-Z"<br>2. Quan sát thứ tự<br>3. Chọn sắp xếp "Tên Z-A"<br>4. Quan sát thứ tự |
| **Dữ liệu test** | Dự án: "Alpha", "Beta", "Gamma" |
| **Kết quả mong đợi** | - "A-Z": Alpha → Beta → Gamma<br>- "Z-A": Gamma → Beta → Alpha |

---

### TC-DB-007: Nhấn vào dự án để xem chi tiết {#tc-db-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Điều hướng đến trang chi tiết khi nhấn vào dự án |
| **Điều kiện tiên quyết** | - Đang ở trang dashboard<br>- Có ít nhất 1 dự án hiển thị |
| **Các bước thực hiện** | 1. Nhấn vào card/row dự án "E-Commerce App" (id: 1)<br>2. Quan sát trang chuyển đến |
| **Dữ liệu test** | Project ID: `1` |
| **Kết quả mong đợi** | - Chuyển hướng đến trang `/dashboard/project/1`<br>- Trang chi tiết dự án hiển thị đúng thông tin<br>- Hiển thị header dự án, quick stats, recent activities |

---

### TC-DB-008: Nhấn nút tạo dự án mới {#tc-db-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Điều hướng đến trang tạo dự án mới |
| **Điều kiện tiên quyết** | - Đang ở trang dashboard |
| **Các bước thực hiện** | 1. Nhấn nút "Tạo dự án mới" hoặc "+" trên dashboard<br>2. Quan sát trang chuyển đến |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Chuyển hướng đến trang `/new-project`<br>- Form tạo dự án hiển thị đúng (tên, mô tả, ngày hết hạn)<br>- Form sẵn sàng nhập liệu |

---

### TC-DB-009: Hiển thị layout dashboard đúng {#tc-db-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra layout và thành phần giao diện dashboard |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang dashboard |
| **Các bước thực hiện** | 1. Quan sát Header (logo, navigation, user menu)<br>2. Quan sát Sidebar (menu điều hướng)<br>3. Quan sát vùng nội dung chính (danh sách dự án)<br>4. Kiểm tra responsive trên các kích thước màn hình |
| **Dữ liệu test** | Kích thước: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667) |
| **Kết quả mong đợi** | - Header hiển thị đầy đủ: logo, tên người dùng, nút menu<br>- Sidebar có đầy đủ menu items<br>- Nội dung chính responsive tốt<br>- Trên mobile: sidebar collapse thành hamburger menu |

---

### TC-DB-010: Truy cập dashboard khi chưa đăng nhập {#tc-db-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập dashboard mà không có token xác thực |
| **Điều kiện tiên quyết** | - Người dùng chưa đăng nhập (không có cookie token) |
| **Các bước thực hiện** | 1. Mở trình duyệt mới (incognito)<br>2. Truy cập URL `/dashboard`<br>3. Quan sát phản hồi |
| **Dữ liệu test** | URL: `/dashboard` |
| **Kết quả mong đợi** | - Middleware phát hiện không có access token và refresh token<br>- Chuyển hướng tự động đến `/login`<br>- Không hiển thị dữ liệu dashboard |
