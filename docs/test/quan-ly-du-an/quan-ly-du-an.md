# Báo Cáo Kiểm Thử - Chức Năng Quản Lý Dự Án

**Ngày cập nhật**: 12/03/2026  
**Module**: Project Management - Quản lý dự án  
**Phiên bản**: 2.0  
**Tổng số test case**: 18

---

## Mục lục

1. [TC-PM-001: Tạo dự án thành công](#tc-pm-001)
2. [TC-PM-002: Tạo dự án thiếu tên](#tc-pm-002)
3. [TC-PM-003: Tạo dự án chỉ nhập tên](#tc-pm-003)
4. [TC-PM-004: Tạo dự án với đầy đủ thông tin](#tc-pm-004)
5. [TC-PM-005: Tạo dự án với tên chỉ có khoảng trắng](#tc-pm-005)
6. [TC-PM-006: Xem tổng quan dự án](#tc-pm-006)
7. [TC-PM-007: Xem thông tin chi tiết dự án](#tc-pm-007)
8. [TC-PM-008: Cập nhật tên dự án](#tc-pm-008)
9. [TC-PM-009: Cập nhật mô tả dự án](#tc-pm-009)
10. [TC-PM-010: Cập nhật dự án thiếu tên](#tc-pm-010)
11. [TC-PM-011: Xóa dự án (Soft Delete)](#tc-pm-011)
12. [TC-PM-012: Hủy xóa dự án](#tc-pm-012)
13. [TC-PM-013: Dự án đã xóa không hiển thị](#tc-pm-013)
14. [TC-PM-014: Truy cập dự án không tồn tại](#tc-pm-014)
15. [TC-PM-015: Truy cập dự án của người dùng khác](#tc-pm-015)
16. [TC-PM-016: Điều hướng từ tổng quan đến tính năng](#tc-pm-016)
17. [TC-PM-017: Hiển thị thống kê nhanh](#tc-pm-017)
18. [TC-PM-018: Tạo dự án khi chưa đăng nhập](#tc-pm-018)

---

### TC-PM-001: Tạo dự án thành công {#tc-pm-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo dự án mới với tên hợp lệ |
| **Điều kiện tiên quyết** | - Người dùng đã đăng nhập<br>- Đang ở trang `/new-project` |
| **Các bước thực hiện** | 1. Nhập tên dự án: "E-Commerce Platform"<br>2. Nhập mô tả: "Hệ thống thương mại điện tử"<br>3. Nhấn nút "Create Project" |
| **Dữ liệu test** | API: `POST /api/v1/projects/`<br>Body: `{ name: "E-Commerce Platform", description: "Hệ thống thương mại điện tử", status: "active" }`<br>Expected response status: 201 |
| **Kết quả mong đợi** | - Dự án tạo thành công<br>- Chuyển hướng đến `/dashboard/project/{projectId}`<br>- Trang overview hiển thị đúng tên và mô tả<br>- status mặc định là "active"<br>- due_date mặc định 30 ngày từ thời điểm tạo |

---

### TC-PM-002: Tạo dự án thiếu tên {#tc-pm-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo dự án khi không nhập tên |
| **Điều kiện tiên quyết** | - Đang ở trang `/new-project` |
| **Các bước thực hiện** | 1. Để trống trường tên dự án<br>2. Nhập mô tả: "Test project"<br>3. Kiểm tra trạng thái nút "Create Project" |
| **Dữ liệu test** | Tên dự án: `""` (rỗng) |
| **Kết quả mong đợi** | - Nút "Create Project" bị vô hiệu hóa (disabled)<br>- Không gửi request API<br>- Hiển thị thông báo lỗi hoặc field validation |

---

### TC-PM-003: Tạo dự án chỉ nhập tên {#tc-pm-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo dự án chỉ với tên, các trường khác để mặc định |
| **Điều kiện tiên quyết** | - Đang ở trang `/new-project` |
| **Các bước thực hiện** | 1. Nhập tên dự án: "Quick Project"<br>2. Để trống mô tả và các trường tùy chọn<br>3. Nhấn nút "Create Project" |
| **Dữ liệu test** | name: `"Quick Project"`, description: `""`, còn lại mặc định |
| **Kết quả mong đợi** | - Dự án tạo thành công với giá trị mặc định:<br>  + status: "active"<br>  + team_size: 1<br>  + project_priority: "low"<br>  + due_date: now + 30 ngày<br>  + settings: {} |

---

### TC-PM-004: Tạo dự án với đầy đủ thông tin {#tc-pm-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo dự án với tất cả các trường được điền |
| **Điều kiện tiên quyết** | - Đang ở trang `/new-project` |
| **Các bước thực hiện** | 1. Nhập tên: "CRM System"<br>2. Nhập mô tả: "Customer Relationship Management"<br>3. Chọn ngày hết hạn: ngày cụ thể<br>4. Chọn team size: "medium (6-15)"<br>5. Chọn priority: "high"<br>6. Nhấn nút "Create Project" |
| **Dữ liệu test** | name: `"CRM System"`, description: `"Customer Relationship Management"`, team_size: `10`, project_priority: `"high"`, due_date: `"2026-06-01"` |
| **Kết quả mong đợi** | - Dự án tạo thành công<br>- Tất cả các giá trị đã nhập được lưu đúng<br>- Trang overview hiển thị team size, priority, due date đúng |

---

### TC-PM-005: Tạo dự án với tên chỉ có khoảng trắng {#tc-pm-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo dự án khi tên chỉ chứa ký tự khoảng trắng |
| **Điều kiện tiên quyết** | - Đang ở trang `/new-project` |
| **Các bước thực hiện** | 1. Nhập tên dự án: "   " (chỉ khoảng trắng)<br>2. Nhấn nút "Create Project" |
| **Dữ liệu test** | Tên dự án: `"   "` (3 ký tự space) |
| **Kết quả mong đợi** | - Sau khi `.trim()` tên trở thành rỗng<br>- Nút "Create Project" bị vô hiệu hóa<br>- Không gửi request API |

---

### TC-PM-006: Xem tổng quan dự án {#tc-pm-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem trang tổng quan dự án đã tạo |
| **Điều kiện tiên quyết** | - Đã tạo dự án "E-Commerce Platform" với ID = 1<br>- Đã đăng nhập |
| **Các bước thực hiện** | 1. Truy cập `/dashboard/project/1`<br>2. Quan sát các thành phần trên trang |
| **Dữ liệu test** | API: `GET /api/v1/projects/1` |
| **Kết quả mong đợi** | - Hiển thị ProjectHeader: tên "E-Commerce Platform", mô tả, badge trạng thái "active"<br>- Hiển thị ProgressSection (thanh tiến độ)<br>- Hiển thị ProjectInfoCards: team size, priority, due date<br>- Hiển thị QuickStatsSection: Documents, Wireframes, Diagrams, AI Chats<br>- Hiển thị RecentActivitySection<br>- Hiển thị TasksOverviewSection<br>- Hiển thị DeleteProjectSection (vùng nguy hiểm) |

---

### TC-PM-007: Xem thông tin chi tiết dự án {#tc-pm-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra thông tin chi tiết dự án hiển thị đúng |
| **Điều kiện tiên quyết** | - Dự án tồn tại với đầy đủ thông tin<br>- team_size: 10, priority: "high", due_date: "2026-06-01" |
| **Các bước thực hiện** | 1. Truy cập trang overview dự án<br>2. Kiểm tra từng thẻ thông tin (ProjectInfoCards)<br>3. Kiểm tra format ngày tháng<br>4. Kiểm tra hiển thị priority badge |
| **Dữ liệu test** | Dự án: team_size=10, priority="high", due_date="2026-06-01" |
| **Kết quả mong đợi** | - Thẻ Team Size hiển thị: "10"<br>- Thẻ Priority hiển thị: "High" với badge tương ứng<br>- Thẻ Due Date hiển thị ngày đúng format<br>- Trạng thái "active" hiển thị với badge phù hợp |

---

### TC-PM-008: Cập nhật tên dự án {#tc-pm-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa tên dự án thông qua Edit dialog |
| **Điều kiện tiên quyết** | - Dự án "E-Commerce Platform" đã tồn tại (ID = 1)<br>- Đang ở trang overview dự án |
| **Các bước thực hiện** | 1. Nhấn nút "Edit Project" trên ProjectHeader<br>2. EditProjectDialog xuất hiện với tên hiện tại<br>3. Thay đổi tên thành "E-Commerce Platform v2"<br>4. Nhấn "Save" |
| **Dữ liệu test** | API: `PUT /api/v1/projects/1`<br>Body: `{ name: "E-Commerce Platform v2", description: "...", status: "active", ... }` |
| **Kết quả mong đợi** | - Dialog đóng lại<br>- Tên dự án trên ProjectHeader cập nhật thành "E-Commerce Platform v2"<br>- Không cần tải lại trang (cập nhật state local) |

---

### TC-PM-009: Cập nhật mô tả dự án {#tc-pm-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa mô tả dự án thông qua Edit dialog |
| **Điều kiện tiên quyết** | - Dự án tồn tại, đang ở trang overview |
| **Các bước thực hiện** | 1. Nhấn nút "Edit Project"<br>2. Chỉnh sửa mô tả thành "Mô tả cập nhật mới"<br>3. Giữ nguyên tên<br>4. Nhấn "Save" |
| **Dữ liệu test** | Description mới: `"Mô tả cập nhật mới"` |
| **Kết quả mong đợi** | - Cập nhật thành công<br>- Mô tả mới hiển thị trên trang overview<br>- `updated_at` được cập nhật trên server |

---

### TC-PM-010: Cập nhật dự án thiếu tên {#tc-pm-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa dự án khi xóa trống tên |
| **Điều kiện tiên quyết** | - Đang mở EditProjectDialog |
| **Các bước thực hiện** | 1. Xóa toàn bộ nội dung trường tên<br>2. Nhấn "Save" |
| **Dữ liệu test** | name: `""` (rỗng) |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi: "Project name is required"<br>- Dialog không đóng<br>- Dữ liệu không được lưu |

---

### TC-PM-011: Xóa dự án (Soft Delete) {#tc-pm-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xóa dự án thông qua vùng Danger Zone |
| **Điều kiện tiên quyết** | - Dự án "Test Delete Project" tồn tại (ID = 5)<br>- Đang ở trang overview dự án |
| **Các bước thực hiện** | 1. Kéo xuống phần "Danger Zone" (DeleteProjectSection)<br>2. Nhấn nút "Delete this project"<br>3. AlertDialog xuất hiện cảnh báo<br>4. Đọc nội dung cảnh báo liệt kê dữ liệu bị ảnh hưởng<br>5. Nhấn nút xác nhận xóa (nút đỏ) |
| **Dữ liệu test** | API: `DELETE /api/projects/5` |
| **Kết quả mong đợi** | - Hiển thị cảnh báo: "This action cannot be undone"<br>- Liệt kê dữ liệu ảnh hưởng: SRS, Wireframes, Diagrams, AI Conversations, Settings<br>- Sau xác nhận: chuyển hướng về `/dashboard`<br>- Dự án status = "deleted" (soft delete, không xóa khỏi DB)<br>- Dự án không hiển thị trong danh sách dashboard |

---

### TC-PM-012: Hủy xóa dự án {#tc-pm-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hủy thao tác xóa dự án tại bước xác nhận |
| **Điều kiện tiên quyết** | - AlertDialog xóa dự án đang mở |
| **Các bước thực hiện** | 1. Nhấn "Delete this project"<br>2. AlertDialog hiển thị<br>3. Nhấn nút "Cancel" hoặc đóng dialog |
| **Dữ liệu test** | Không gửi API request |
| **Kết quả mong đợi** | - Dialog đóng lại<br>- Dự án vẫn còn nguyên, không bị xóa<br>- Vẫn ở trang overview dự án |

---

### TC-PM-013: Dự án đã xóa không hiển thị {#tc-pm-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra dự án đã soft-delete không hiển thị trong danh sách |
| **Điều kiện tiên quyết** | - Đã xóa dự án "Test Delete Project"<br>- Dự án có status = "deleted" |
| **Các bước thực hiện** | 1. Truy cập trang dashboard (`/dashboard`)<br>2. Kiểm tra danh sách dự án<br>3. Thử truy cập trực tiếp URL `/dashboard/project/5` |
| **Dữ liệu test** | API `GET /api/v1/projects/` filter: `status != "deleted"` |
| **Kết quả mong đợi** | - Danh sách dashboard không hiển thị dự án đã xóa<br>- Truy cập trực tiếp URL → nhận lỗi 404 "Project not found"<br>- API lọc dự án deleted khỏi kết quả |

---

### TC-PM-014: Truy cập dự án không tồn tại {#tc-pm-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập trang dự án với ID không tồn tại |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Truy cập URL `/dashboard/project/99999`<br>2. Quan sát phản hồi |
| **Dữ liệu test** | Project ID: `99999` (không tồn tại) |
| **Kết quả mong đợi** | - API trả về 404 "Project not found"<br>- Hiển thị trang lỗi hoặc chuyển hướng về dashboard<br>- Không hiển thị dữ liệu rỗng gây nhầm lẫn |

---

### TC-PM-015: Truy cập dự án của người dùng khác {#tc-pm-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập dự án thuộc sở hữu của tài khoản khác |
| **Điều kiện tiên quyết** | - Đăng nhập với tài khoản User A<br>- Dự án ID = 10 thuộc User B |
| **Các bước thực hiện** | 1. Truy cập URL `/dashboard/project/10`<br>2. Quan sát phản hồi |
| **Dữ liệu test** | Project ID: `10` (thuộc user khác) |
| **Kết quả mong đợi** | - Backend kiểm tra `user_id != current_user.id`<br>- Trả về 404 "Project not found" (không tiết lộ dự án tồn tại)<br>- Không hiển thị bất kỳ dữ liệu nào của dự án |

---

### TC-PM-016: Điều hướng từ tổng quan đến tính năng {#tc-pm-016}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhấn vào các link trên trang overview để điều hướng đến tính năng con |
| **Điều kiện tiên quyết** | - Đang ở trang overview dự án (ID = 1)<br>- Có recent activities hiển thị |
| **Các bước thực hiện** | 1. Nhấn vào activity link "Workflows" → kiểm tra URL<br>2. Quay lại overview<br>3. Nhấn vào activity link "SRS Generator" → kiểm tra URL<br>4. Quay lại overview<br>5. Nhấn vào activity link "Diagrams" → kiểm tra URL |
| **Dữ liệu test** | Links:<br>- Workflows → `/dashboard/project/1/workflows`<br>- SRS → `/dashboard/project/1/srsgenerator`<br>- Diagrams → `/dashboard/project/1/diagrams` |
| **Kết quả mong đợi** | - Mỗi link điều hướng đến đúng trang tính năng<br>- Trang đích tải thành công và hiển thị nội dung tương ứng<br>- Không gặp lỗi 404 |

---

### TC-PM-017: Hiển thị thống kê nhanh {#tc-pm-017}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra phần Quick Stats trên trang overview |
| **Điều kiện tiên quyết** | - Dự án đã tạo, đang ở trang overview |
| **Các bước thực hiện** | 1. Quan sát phần QuickStatsSection<br>2. Kiểm tra các thẻ thống kê |
| **Dữ liệu test** | Mock data: Documents=0, Wireframes=0, Diagrams=0, AI Chats=0 |
| **Kết quả mong đợi** | - Hiển thị 4 thẻ thống kê: Documents, Wireframes, Diagrams, AI Chats<br>- Mỗi thẻ có icon, label, và giá trị số<br>- Giá trị hiển thị đúng (có thể là 0 cho dự án mới) |

---

### TC-PM-018: Tạo dự án khi chưa đăng nhập {#tc-pm-018}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập trang tạo dự án mới khi chưa xác thực |
| **Điều kiện tiên quyết** | - Người dùng chưa đăng nhập (không có token) |
| **Các bước thực hiện** | 1. Mở trình duyệt incognito<br>2. Truy cập URL `/new-project`<br>3. Quan sát phản hồi |
| **Dữ liệu test** | URL: `/new-project`, không có access token |
| **Kết quả mong đợi** | - Middleware phát hiện không có token<br>- Chuyển hướng về trang `/login`<br>- Không hiển thị form tạo dự án |
