# Báo Cáo Kiểm Thử - Chức Năng Tạo Sơ Đồ (Diagram)

**Ngày cập nhật**: 12/03/2026  
**Module**: Diagram Generator - Tạo sơ đồ UML  
**Phiên bản**: 2.0  
**Tổng số test case**: 18

---

## Mục lục

1. [TC-DG-001: Tạo Use Case Diagram](#tc-dg-001)
2. [TC-DG-002: Tạo Class Diagram](#tc-dg-002)
3. [TC-DG-003: Tạo Activity Diagram](#tc-dg-003)
4. [TC-DG-004: Từ chối loại diagram không hợp lệ](#tc-dg-004)
5. [TC-DG-005: Tạo diagram với file đính kèm](#tc-dg-005)
6. [TC-DG-006: Xem danh sách diagram](#tc-dg-006)
7. [TC-DG-007: Xem danh sách diagram khi trống](#tc-dg-007)
8. [TC-DG-008: Xem chi tiết diagram](#tc-dg-008)
9. [TC-DG-009: Hiển thị Mermaid rendered](#tc-dg-009)
10. [TC-DG-010: Cập nhật nội dung diagram](#tc-dg-010)
11. [TC-DG-011: Tạo lại diagram (Regenerate)](#tc-dg-011)
12. [TC-DG-012: Tự động đặt tên khi trùng](#tc-dg-012)
13. [TC-DG-013: Kiểm tra routing AI theo loại diagram](#tc-dg-013)
14. [TC-DG-014: Fallback dữ liệu mock khi AI lỗi](#tc-dg-014)
15. [TC-DG-015: Truy cập diagram người dùng khác](#tc-dg-015)
16. [TC-DG-016: Kiểm tra metadata mapping](#tc-dg-016)
17. [TC-DG-017: Chat session được tạo đúng](#tc-dg-017)
18. [TC-DG-018: Tạo diagram khi chưa đăng nhập](#tc-dg-018)

---

### TC-DG-001: Tạo Use Case Diagram {#tc-dg-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo sơ đồ Use Case thành công |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Dự án tồn tại (project_id = 1) |
| **Các bước thực hiện** | 1. Truy cập trang Diagrams (`/dashboard/project/1/diagrams`)<br>2. Chọn loại: "Use Case"<br>3. Nhập Title: "Authentication Use Cases"<br>4. Nhập Description: "Đăng nhập, đăng ký, quên mật khẩu"<br>5. Nhấn "Generate" |
| **Dữ liệu test** | API: `POST /api/v1/diagram/generate`<br>Body: `{ project_id: 1, diagram_type: "usecase", title: "Authentication Use Cases", description: "Đăng nhập, đăng ký, quên mật khẩu" }` |
| **Kết quả mong đợi** | - Diagram tạo thành công (status 201)<br>- Trả về diagram_id (UUID), content_md (Mermaid syntax)<br>- AI sử dụng URL: `ai_service_url_diagram_usecase`<br>- File lưu tại: `{user_id}/1/usecase/{title}.md` |

---

### TC-DG-002: Tạo Class Diagram {#tc-dg-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo sơ đồ Class thành công |
| **Điều kiện tiên quyết** | - Dự án tồn tại |
| **Các bước thực hiện** | 1. Chọn loại: "Class"<br>2. Nhập Title: "Entity Relationships"<br>3. Nhập Description: "User, Product, Order, Payment"<br>4. Nhấn "Generate" |
| **Dữ liệu test** | diagram_type: `"class"`, title: `"Entity Relationships"` |
| **Kết quả mong đợi** | - Diagram tạo thành công<br>- content_md chứa Mermaid class diagram syntax<br>- Hiển thị classes, attributes, methods, relationships<br>- AI sử dụng URL: `ai_service_url_diagram_class` |

---

### TC-DG-003: Tạo Activity Diagram {#tc-dg-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo sơ đồ Activity thành công |
| **Điều kiện tiên quyết** | - Dự án tồn tại |
| **Các bước thực hiện** | 1. Chọn loại: "Activity"<br>2. Nhập Title: "Order Processing Flow"<br>3. Nhập Description: "Luồng xử lý đơn hàng từ tạo đến thanh toán"<br>4. Nhấn "Generate" |
| **Dữ liệu test** | diagram_type: `"activity"`, title: `"Order Processing Flow"` |
| **Kết quả mong đợi** | - Diagram tạo thành công<br>- content_md chứa flowchart/activity Mermaid syntax<br>- Hiển thị decision points, parallel activities<br>- AI sử dụng URL: `ai_service_url_diagram_activity` |

---

### TC-DG-004: Từ chối loại diagram không hợp lệ {#tc-dg-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi request với diagram_type không nằm trong danh sách cho phép |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Gọi trực tiếp API với diagram_type không hợp lệ |
| **Dữ liệu test** | API: `POST /api/v1/diagram/generate`<br>Body: `{ diagram_type: "sequence" }` (không hỗ trợ)<br>Allowed: usecase, class, activity |
| **Kết quả mong đợi** | - API trả về lỗi 400: Invalid diagram type<br>- Không tạo bất kỳ file nào<br>- Thông báo rõ các loại được hỗ trợ |

---

### TC-DG-005: Tạo diagram với file đính kèm {#tc-dg-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo diagram kèm upload file tham chiếu |
| **Điều kiện tiên quyết** | - Có file `requirements.txt` để đính kèm |
| **Các bước thực hiện** | 1. Chọn loại diagram<br>2. Nhập title và description<br>3. Upload file tham chiếu<br>4. Nhấn "Generate" |
| **Dữ liệu test** | File: `requirements.txt`, storage_paths gửi cho AI |
| **Kết quả mong đợi** | - File được upload thành công<br>- storage_paths truyền vào AI cùng message<br>- AI tham chiếu nội dung file khi tạo diagram |

---

### TC-DG-006: Xem danh sách diagram {#tc-dg-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem tất cả diagram đã tạo trong dự án |
| **Điều kiện tiên quyết** | - Dự án có 3 diagram: 1 usecase, 1 class, 1 activity |
| **Các bước thực hiện** | 1. Truy cập trang Diagrams<br>2. Xem danh sách diagram |
| **Dữ liệu test** | API: `GET /api/v1/diagram/list/1`<br>Response: 3 diagrams |
| **Kết quả mong đợi** | - Hiển thị 3 diagram trong danh sách<br>- Mỗi item có: title, diagram_type, ngày tạo<br>- Có thể phân biệt loại diagram qua icon/badge |

---

### TC-DG-007: Xem danh sách diagram khi trống {#tc-dg-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem trang diagram khi chưa tạo diagram nào |
| **Điều kiện tiên quyết** | - Dự án mới, chưa có diagram |
| **Các bước thực hiện** | 1. Truy cập trang Diagrams của dự án mới |
| **Dữ liệu test** | API trả về danh sách rỗng |
| **Kết quả mong đợi** | - Hiển thị empty state<br>- Có hướng dẫn hoặc nút tạo diagram đầu tiên<br>- Không lỗi |

---

### TC-DG-008: Xem chi tiết diagram {#tc-dg-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem nội dung chi tiết một diagram cụ thể |
| **Điều kiện tiên quyết** | - Diagram đã tạo (diagram_id = "dia-123") |
| **Các bước thực hiện** | 1. Nhấn vào diagram trong danh sách<br>2. Quan sát nội dung hiển thị |
| **Dữ liệu test** | API: `GET /api/v1/diagram/get/1/dia-123` |
| **Kết quả mong đợi** | - Hiển thị content_md (Mermaid source code)<br>- Hiển thị diagram rendered (nếu có Mermaid renderer)<br>- Thông tin: title, diagram_type, generated_at |

---

### TC-DG-009: Hiển thị Mermaid rendered {#tc-dg-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra Mermaid diagram render đúng trên UI |
| **Điều kiện tiên quyết** | - Diagram có content_md chứa Mermaid syntax hợp lệ |
| **Các bước thực hiện** | 1. Mở chi tiết diagram Use Case<br>2. Kiểm tra phần preview rendered |
| **Dữ liệu test** | content_md: ```mermaid\ngraph TD\nA[Start]-->B[End]\n``` |
| **Kết quả mong đợi** | - Mermaid syntax được parse và render thành hình ảnh/SVG<br>- Hiển thị đúng các node, edge, label<br>- Không hiển thị raw text Mermaid |

---

### TC-DG-010: Cập nhật nội dung diagram {#tc-dg-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa nội dung Mermaid của diagram |
| **Điều kiện tiên quyết** | - Diagram đã tạo |
| **Các bước thực hiện** | 1. Mở chi tiết diagram<br>2. Chỉnh sửa content_md<br>3. Nhấn "Save" |
| **Dữ liệu test** | API: `PUT /api/v1/diagram/update/1/dia-123`<br>Body: `{ diagram_type: "usecase", content_md: "Updated Mermaid..." }` |
| **Kết quả mong đợi** | - Nội dung cập nhật thành công<br>- Diagram re-render với nội dung mới<br>- update_at cập nhật |

---

### TC-DG-011: Tạo lại diagram (Regenerate) {#tc-dg-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo lại diagram với mô tả mới |
| **Điều kiện tiên quyết** | - Diagram đã tạo (diagram_id = "dia-123") |
| **Các bước thực hiện** | 1. Nhấn "Regenerate"<br>2. Nhập description mới: "Thêm use case quản lý đơn hàng"<br>3. Xác nhận |
| **Dữ liệu test** | API: `PATCH /api/v1/diagram/regenerate/1/dia-123`<br>Body: `{ description: "Thêm use case quản lý đơn hàng" }` |
| **Kết quả mong đợi** | - AI tạo lại diagram với nội dung cập nhật<br>- diagram_id giữ nguyên<br>- content_md mới phản ánh yêu cầu bổ sung<br>- Tạo thêm cặp chat_session mới |

---

### TC-DG-012: Tự động đặt tên khi trùng {#tc-dg-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo diagram cùng tên và kiểm tra auto-increment |
| **Điều kiện tiên quyết** | - Đã có diagram tên "Diagram" |
| **Các bước thực hiện** | 1. Tạo diagram mới (hệ thống auto-generate tên)<br>2. Kiểm tra tên file |
| **Dữ liệu test** | Tên hiện tại: "Diagram"<br>Pattern regex: `^{base}\s*\((?P<suffix>\d+)\)$` |
| **Kết quả mong đợi** | - Tên mới: "Diagram (1)"<br>- Tiếp tục tạo: "Diagram (2)"<br>- Không xung đột tên file trên Supabase |

---

### TC-DG-013: Kiểm tra routing AI theo loại diagram {#tc-dg-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xác minh mỗi loại diagram gọi đúng AI service URL |
| **Điều kiện tiên quyết** | - AI service đang hoạt động |
| **Các bước thực hiện** | 1. Tạo usecase diagram → kiểm tra URL gọi<br>2. Tạo class diagram → kiểm tra URL gọi<br>3. Tạo activity diagram → kiểm tra URL gọi |
| **Dữ liệu test** | Mapping:<br>- usecase → `ai_service_url_diagram_usecase`<br>- class → `ai_service_url_diagram_class`<br>- activity → `ai_service_url_diagram_activity` |
| **Kết quả mong đợi** | - Mỗi loại diagram gọi đúng AI endpoint tương ứng<br>- AI trả về content phù hợp với loại diagram<br>- Không gọi nhầm endpoint |

---

### TC-DG-014: Fallback dữ liệu mock khi AI lỗi {#tc-dg-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra fallback sang mock data khi AI service lỗi |
| **Điều kiện tiên quyết** | - AI service đang offline |
| **Các bước thực hiện** | 1. Tạo diagram khi AI service không khả dụng<br>2. Quan sát kết quả |
| **Dữ liệu test** | AI service trả về non-200 status |
| **Kết quả mong đợi** | - Hệ thống sử dụng mock data từ `diagram_mock_data.py`<br>- Diagram vẫn được tạo với nội dung mẫu<br>- Người dùng có thể regenerate sau khi AI phục hồi |

---

### TC-DG-015: Truy cập diagram người dùng khác {#tc-dg-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập diagram thuộc dự án của người dùng khác |
| **Điều kiện tiên quyết** | - Đăng nhập User A<br>- Diagram thuộc dự án của User B |
| **Các bước thực hiện** | 1. Gọi API lấy diagram của User B |
| **Dữ liệu test** | project_id thuộc User B |
| **Kết quả mong đợi** | - API trả về 403 Permission Denied<br>- Không hiển thị nội dung diagram<br>- Bảo mật dữ liệu giữa người dùng |

---

### TC-DG-016: Kiểm tra metadata mapping {#tc-dg-016}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra doc_type mapping trong metadata |
| **Điều kiện tiên quyết** | - Tạo thành công 3 loại diagram |
| **Các bước thực hiện** | 1. Kiểm tra metadata JSONB trong database cho mỗi loại |
| **Dữ liệu test** | Mapping doc_type:<br>- usecase → "usecase-diagram"<br>- class → "class-diagram"<br>- activity → "activity-diagram" |
| **Kết quả mong đợi** | - Metadata chứa doc_type mapping chính xác<br>- message chứa input_description<br>- ai_response chứa full AI response |

---

### TC-DG-017: Chat session được tạo đúng {#tc-dg-017}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra cặp chat_session tạo khi generate diagram |
| **Điều kiện tiên quyết** | - Tạo diagram thành công |
| **Các bước thực hiện** | 1. Tạo một diagram<br>2. Kiểm tra bảng Chat_Session trong database |
| **Dữ liệu test** | 2 bản ghi Chat_Session: role="user" và role="ai" |
| **Kết quả mong đợi** | - Bản ghi 1: role="user", message = input_description<br>- Bản ghi 2: role="ai", message = JSON.stringify(AI response)<br>- content_type và content_id liên kết đúng diagram |

---

### TC-DG-018: Tạo diagram khi chưa đăng nhập {#tc-dg-018}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gọi API tạo diagram mà không có token xác thực |
| **Điều kiện tiên quyết** | - Không có Bearer token trong request |
| **Các bước thực hiện** | 1. Gọi `POST /api/v1/diagram/generate` mà không gửi Authorization header |
| **Dữ liệu test** | Không có Authorization: Bearer {token} |
| **Kết quả mong đợi** | - API trả về 401 Unauthorized<br>- Không tạo diagram<br>- Yêu cầu xác thực |
