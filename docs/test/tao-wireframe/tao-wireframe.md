# Báo Cáo Kiểm Thử - Chức Năng Tạo Wireframe

**Ngày cập nhật**: 12/03/2026  
**Module**: Wireframe Generator - Tạo bản mẫu giao diện  
**Phiên bản**: 2.0  
**Tổng số test case**: 12

---

## Mục lục

1. [TC-WF-001: Tạo wireframe cho Desktop](#tc-wf-001)
2. [TC-WF-002: Tạo wireframe cho Tablet](#tc-wf-002)
3. [TC-WF-003: Tạo wireframe cho Mobile](#tc-wf-003)
4. [TC-WF-004: Xem preview HTML/CSS trực tiếp](#tc-wf-004)
5. [TC-WF-005: Chỉnh sửa HTML trong split view](#tc-wf-005)
6. [TC-WF-006: Chỉnh sửa CSS trong split view](#tc-wf-006)
7. [TC-WF-007: Xem danh sách wireframe](#tc-wf-007)
8. [TC-WF-008: Xem danh sách wireframe khi trống](#tc-wf-008)
9. [TC-WF-009: Xem chi tiết wireframe](#tc-wf-009)
10. [TC-WF-010: Tạo lại wireframe (Regenerate)](#tc-wf-010)
11. [TC-WF-011: Kiểm tra tài liệu phụ thuộc bắt buộc](#tc-wf-011)
12. [TC-WF-012: Trích xuất HTML/CSS từ nhiều format](#tc-wf-012)

---

### TC-WF-001: Tạo wireframe cho Desktop {#tc-wf-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo wireframe với device type Desktop (1920x1080) |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Dự án tồn tại (project_id = 1)<br>- Có đủ tài liệu phụ thuộc: srs, high-level-requirements |
| **Các bước thực hiện** | 1. Truy cập trang Wireframe Generator (`/dashboard/project/1/wireframegenerator`)<br>2. Chọn Device Type: "Desktop" (1920 × 1080)<br>3. Nhập Wireframe Name: "Admin Dashboard"<br>4. Nhập Description: "Trang dashboard quản trị viên với sidebar, charts, tables"<br>5. Nhấn "Generate" |
| **Dữ liệu test** | API: `POST /api/v1/wireframe/generate`<br>Body: `{ project_id: 1, device_type: "desktop", wireframe_name: "Admin Dashboard", description: "..." }` |
| **Kết quả mong đợi** | - Wireframe tạo thành công<br>- Trả về wireframe_id (UUID), html_content, css_content<br>- input_description chứa device_type + description<br>- File lưu tại: `{user_id}/1/Wireframe/{title}.md` |

---

### TC-WF-002: Tạo wireframe cho Tablet {#tc-wf-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo wireframe với device type Tablet (768x1024) |
| **Điều kiện tiên quyết** | - Có đủ tài liệu phụ thuộc |
| **Các bước thực hiện** | 1. Chọn Device Type: "Tablet" (768 × 1024)<br>2. Nhập tên: "Product Listing"<br>3. Nhập mô tả<br>4. Nhấn "Generate" |
| **Dữ liệu test** | device_type: `"tablet"`, wireframe_name: `"Product Listing"` |
| **Kết quả mong đợi** | - Wireframe tạo với viewport 768x1024<br>- AI tạo layout phù hợp tablet (responsive grid)<br>- html_content và css_content được trích xuất |

---

### TC-WF-003: Tạo wireframe cho Mobile {#tc-wf-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo wireframe với device type Mobile (375x667) |
| **Điều kiện tiên quyết** | - Có đủ tài liệu phụ thuộc |
| **Các bước thực hiện** | 1. Chọn Device Type: "Mobile" (375 × 667)<br>2. Nhập tên: "Login Screen"<br>3. Nhập mô tả: "Màn hình đăng nhập mobile"<br>4. Nhấn "Generate" |
| **Dữ liệu test** | device_type: `"mobile"`, wireframe_name: `"Login Screen"` |
| **Kết quả mong đợi** | - Wireframe tạo với viewport 375x667<br>- Layout stack dọc phù hợp mobile<br>- html_content và css_content phản ánh responsive mobile |

---

### TC-WF-004: Xem preview HTML/CSS trực tiếp {#tc-wf-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem wireframe rendered trong iframe preview |
| **Điều kiện tiên quyết** | - Wireframe đã tạo thành công với html_content và css_content |
| **Các bước thực hiện** | 1. Mở chi tiết wireframe (WireframeOverview)<br>2. Quan sát phần Live Preview (iframe) |
| **Dữ liệu test** | html_content: `"<div class='container'>...</div>"`<br>css_content: `".container { padding: 20px; }"` |
| **Kết quả mong đợi** | - Iframe hiển thị HTML + CSS kết hợp (srcDoc)<br>- Giao diện render đúng layout<br>- Không có lỗi JavaScript trong iframe |

---

### TC-WF-005: Chỉnh sửa HTML trong split view {#tc-wf-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa HTML code và xem live preview cập nhật |
| **Điều kiện tiên quyết** | - Đang ở trang WireframeOverview<br>- Split View đang bật |
| **Các bước thực hiện** | 1. Nhấn Toggle Split View<br>2. Chọn tab "HTML"<br>3. Chỉnh sửa HTML trong textarea<br>4. Quan sát preview cập nhật |
| **Dữ liệu test** | Sửa HTML: thêm `<h1>Welcome</h1>` |
| **Kết quả mong đợi** | - Code editor hiển thị HTML hiện tại<br>- Sau chỉnh sửa: preview cập nhật real-time<br>- Tab "HTML" active, tab "CSS" inactive |

---

### TC-WF-006: Chỉnh sửa CSS trong split view {#tc-wf-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa CSS và xem thay đổi trong preview |
| **Điều kiện tiên quyết** | - Split View đang bật |
| **Các bước thực hiện** | 1. Chọn tab "CSS"<br>2. Thêm CSS rule: `body { background: #f0f0f0; }`<br>3. Quan sát preview |
| **Dữ liệu test** | CSS mới: `body { background: #f0f0f0; }` |
| **Kết quả mong đợi** | - Code editor chuyển sang hiển thị CSS<br>- Preview cập nhật với background mới<br>- HTML không bị ảnh hưởng |

---

### TC-WF-007: Xem danh sách wireframe {#tc-wf-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem tất cả wireframe đã tạo trong dự án |
| **Điều kiện tiên quyết** | - Dự án có 3 wireframe: Desktop, Tablet, Mobile |
| **Các bước thực hiện** | 1. Truy cập trang Wireframe Generator<br>2. Xem danh sách wireframe |
| **Dữ liệu test** | API: `GET /api/v1/wireframe/list/1`<br>Response: 3 wireframes |
| **Kết quả mong đợi** | - Hiển thị 3 wireframe trong danh sách<br>- Mỗi item có: title, device type, ngày tạo<br>- Có thể nhấn để xem chi tiết |

---

### TC-WF-008: Xem danh sách wireframe khi trống {#tc-wf-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập Wireframe Generator khi chưa có wireframe nào |
| **Điều kiện tiên quyết** | - Dự án mới, chưa tạo wireframe |
| **Các bước thực hiện** | 1. Truy cập trang Wireframe Generator |
| **Dữ liệu test** | API trả về danh sách rỗng |
| **Kết quả mong đợi** | - Hiển thị empty state<br>- Có nút/form để tạo wireframe đầu tiên<br>- Không lỗi |

---

### TC-WF-009: Xem chi tiết wireframe {#tc-wf-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem chi tiết một wireframe cụ thể |
| **Điều kiện tiên quyết** | - Wireframe đã tạo (wireframe_id = "wf-123") |
| **Các bước thực hiện** | 1. Nhấn vào wireframe trong danh sách<br>2. Quan sát nội dung WireframeOverview |
| **Dữ liệu test** | API: `GET /api/v1/wireframe/get/1/wf-123`<br>Response: html_content, css_content, title |
| **Kết quả mong đợi** | - Hiển thị WireframeOverview component<br>- Live Preview iframe render HTML+CSS<br>- Split View có thể toggle<br>- Có ChatWithAI component cho tương tác<br>- Trên mobile: chat bị ẩn, hiện trên lg+ |

---

### TC-WF-010: Tạo lại wireframe (Regenerate) {#tc-wf-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo lại wireframe với mô tả cập nhật |
| **Điều kiện tiên quyết** | - Wireframe đã tạo (wireframe_id = "wf-123") |
| **Các bước thực hiện** | 1. Mở chi tiết wireframe<br>2. Nhấn "Regenerate"<br>3. Nhập mô tả mới: "Thêm sidebar navigation và search bar"<br>4. Xác nhận |
| **Dữ liệu test** | API: `PATCH /api/v1/wireframe/regenerate/1/wf-123`<br>Body: `{ description: "Thêm sidebar navigation và search bar" }` |
| **Kết quả mong đợi** | - AI tạo lại wireframe với layout mới<br>- wireframe_id giữ nguyên<br>- html_content và css_content cập nhật<br>- Preview hiển thị giao diện mới<br>- Tạo cặp chat_session mới |

---

### TC-WF-011: Kiểm tra tài liệu phụ thuộc bắt buộc {#tc-wf-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo wireframe khi thiếu tài liệu phụ thuộc bắt buộc |
| **Điều kiện tiên quyết** | - Dự án mới chưa có SRS và high-level-requirements |
| **Các bước thực hiện** | 1. Truy cập Wireframe Generator<br>2. Điền thông tin và nhấn "Generate" |
| **Dữ liệu test** | Thiếu tài liệu bắt buộc: `srs`, `high-level-requirements`<br>Recommended thiếu: `stakeholder-register` |
| **Kết quả mong đợi** | - API trả về lỗi 422<br>- Danh sách missing_required: ["srs", "high-level-requirements"]<br>- Hiển thị thông báo yêu cầu tạo SRS trước<br>- recommend_documents chứa tài liệu khuyến nghị |

---

### TC-WF-012: Trích xuất HTML/CSS từ nhiều format {#tc-wf-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hàm extract_html_css_from_content với các format khác nhau |
| **Điều kiện tiên quyết** | - AI trả về response với nhiều format khác nhau |
| **Các bước thực hiện** | 1. Format 1: AI trả JSON `{"html": "...", "css": "..."}`<br>2. Format 2: AI trả HTML code block<br>3. Format 3: AI trả HTML có inline `<style>` tag |
| **Dữ liệu test** | Format 1: ```json\n{"html":"<div>test</div>","css":".test{}"}\n```<br>Format 2: ```html\n<div>test</div>\n```<br>Format 3: `<style>body{color:red}</style><div>test</div>` |
| **Kết quả mong đợi** | - Format 1: Trích xuất đúng html và css từ JSON<br>- Format 2: Trích xuất HTML, css = null<br>- Format 3: Tách `<style>` thành css, phần còn lại là html<br>- Fallback: nội dung gốc được treat as HTML nếu không match |
