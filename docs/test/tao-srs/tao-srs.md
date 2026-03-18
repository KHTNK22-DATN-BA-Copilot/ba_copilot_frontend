# Báo Cáo Kiểm Thử - Chức Năng Tạo Tài Liệu SRS

**Ngày cập nhật**: 12/03/2026  
**Module**: SRS Generator - Tạo tài liệu đặc tả yêu cầu phần mềm  
**Phiên bản**: 2.0  
**Tổng số test case**: 15

---

## Mục lục

1. [TC-SRS-001: Tạo SRS với thông tin tối thiểu](#tc-srs-001)
2. [TC-SRS-002: Tạo SRS với đầy đủ thông tin](#tc-srs-002)
3. [TC-SRS-003: Tạo SRS với file đính kèm](#tc-srs-003)
4. [TC-SRS-004: Kiểm tra tài liệu phụ thuộc bắt buộc](#tc-srs-004)
5. [TC-SRS-005: Phát hiện tài liệu khuyến nghị thiếu](#tc-srs-005)
6. [TC-SRS-006: Xem danh sách SRS của dự án](#tc-srs-006)
7. [TC-SRS-007: Xem SRS khi dự án chưa có tài liệu](#tc-srs-007)
8. [TC-SRS-008: Xem chi tiết một SRS cụ thể](#tc-srs-008)
9. [TC-SRS-009: Cập nhật nội dung SRS](#tc-srs-009)
10. [TC-SRS-010: Cập nhật trạng thái SRS](#tc-srs-010)
11. [TC-SRS-011: Tạo lại SRS (Regenerate)](#tc-srs-011)
12. [TC-SRS-012: Tự động đặt tên duy nhất khi trùng](#tc-srs-012)
13. [TC-SRS-013: SRS của người dùng khác](#tc-srs-013)
14. [TC-SRS-014: AI service không khả dụng](#tc-srs-014)
15. [TC-SRS-015: Tạo SRS và kiểm tra chat session](#tc-srs-015)

---

### TC-SRS-001: Tạo SRS với thông tin tối thiểu {#tc-srs-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo tài liệu SRS chỉ với project name |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Dự án "E-Commerce" đã tồn tại (project_id = 1)<br>- Có đủ tài liệu phụ thuộc bắt buộc (high-level-requirements, scope-statement, feasibility-study) |
| **Các bước thực hiện** | 1. Truy cập trang SRS Generator (`/dashboard/project/1/srsgenerator`)<br>2. Nhập Project Name: "E-Commerce"<br>3. Để trống các trường tùy chọn<br>4. Nhấn nút "Generate SRS" |
| **Dữ liệu test** | API: `POST /api/v1/srs/generate`<br>Body: `{ project_id: 1, project_name: "E-Commerce" }` |
| **Kết quả mong đợi** | - SRS được tạo thành công (status 201)<br>- Trả về document_id (UUID), generated_at, document (Markdown)<br>- Status mặc định: "generated"<br>- File lưu trên Supabase: `{user_id}/1/srs/{unique_title}.md` |

---

### TC-SRS-002: Tạo SRS với đầy đủ thông tin {#tc-srs-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo SRS khi điền đầy đủ tất cả các trường |
| **Điều kiện tiên quyết** | - Dự án tồn tại với đủ tài liệu phụ thuộc |
| **Các bước thực hiện** | 1. Nhập Project Name: "CRM System"<br>2. Nhập Version: "2.0"<br>3. Nhập Project Description<br>4. Nhập Requirements (yêu cầu chức năng)<br>5. Nhập Constraints & Assumptions<br>6. Nhấn "Generate SRS" |
| **Dữ liệu test** | project_name: "CRM System", description: "Hệ thống quản lý khách hàng toàn diện với đầy đủ yêu cầu" |
| **Kết quả mong đợi** | - SRS tạo thành công với nội dung phong phú hơn<br>- input_description chứa description đã nhập<br>- Nội dung Markdown bao gồm các section: Introduction, Scope, Requirements, etc. |

---

### TC-SRS-003: Tạo SRS với file đính kèm {#tc-srs-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo SRS kèm theo upload file tài liệu tham chiếu |
| **Điều kiện tiên quyết** | - Dự án tồn tại<br>- Có file `project_brief.pdf` để đính kèm |
| **Các bước thực hiện** | 1. Điền thông tin SRS cơ bản<br>2. Upload file `project_brief.pdf` vào phần File Uploads<br>3. Nhấn "Generate SRS" |
| **Dữ liệu test** | File upload: `project_brief.pdf`<br>storage_paths gửi cho AI service |
| **Kết quả mong đợi** | - File được upload lên Supabase<br>- storage_paths được gửi cho AI cùng với message<br>- AI sử dụng nội dung file để tạo SRS chi tiết hơn<br>- SRS phản ánh thông tin từ file đính kèm |

---

### TC-SRS-004: Kiểm tra tài liệu phụ thuộc bắt buộc {#tc-srs-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo SRS khi thiếu tài liệu phụ thuộc bắt buộc |
| **Điều kiện tiên quyết** | - Dự án mới, chưa có tài liệu nào<br>- Thiếu: high-level-requirements, scope-statement, feasibility-study |
| **Các bước thực hiện** | 1. Truy cập trang SRS Generator<br>2. Điền thông tin và nhấn "Generate SRS" |
| **Dữ liệu test** | Dự án không có: high-level-requirements, scope-statement, feasibility-study |
| **Kết quả mong đợi** | - API trả về lỗi 422<br>- Response chứa danh sách missing_required<br>- can_proceed = false<br>- Hiển thị thông báo yêu cầu tạo tài liệu phụ thuộc trước |

---

### TC-SRS-005: Phát hiện tài liệu khuyến nghị thiếu {#tc-srs-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra cảnh báo tài liệu khuyến nghị chưa có |
| **Điều kiện tiên quyết** | - Có đủ tài liệu bắt buộc<br>- Thiếu: compliance, stakeholder-register |
| **Các bước thực hiện** | 1. Tạo SRS thành công<br>2. Kiểm tra trường recommend_documents trong response |
| **Dữ liệu test** | Thiếu tài liệu: compliance, stakeholder-register |
| **Kết quả mong đợi** | - SRS vẫn tạo thành công (can_proceed = true)<br>- recommend_documents chứa danh sách tài liệu khuyến nghị thiếu<br>- Hiển thị cảnh báo (warning) cho người dùng |

---

### TC-SRS-006: Xem danh sách SRS của dự án {#tc-srs-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem tất cả tài liệu SRS đã tạo trong dự án |
| **Điều kiện tiên quyết** | - Dự án có 3 SRS đã tạo |
| **Các bước thực hiện** | 1. Truy cập trang SRS Generator<br>2. Xem danh sách SRS ở sidebar/panel |
| **Dữ liệu test** | API: `GET /api/v1/srs/list/1`<br>Response: 3 SRS documents |
| **Kết quả mong đợi** | - Hiển thị danh sách 3 tài liệu SRS<br>- Mỗi item hiển thị: title, status, ngày tạo<br>- Sắp xếp theo ngày tạo/cập nhật |

---

### TC-SRS-007: Xem SRS khi dự án chưa có tài liệu {#tc-srs-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem danh sách SRS khi dự án mới chưa tạo tài liệu nào |
| **Điều kiện tiên quyết** | - Dự án mới, chưa có SRS nào |
| **Các bước thực hiện** | 1. Truy cập trang SRS Generator của dự án mới |
| **Dữ liệu test** | API trả về danh sách rỗng `[]` |
| **Kết quả mong đợi** | - Hiển thị trạng thái trống (empty state)<br>- Có nút/hướng dẫn để tạo SRS đầu tiên<br>- Không hiển thị lỗi |

---

### TC-SRS-008: Xem chi tiết một SRS cụ thể {#tc-srs-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem nội dung chi tiết của một tài liệu SRS |
| **Điều kiện tiên quyết** | - SRS đã tạo với document_id = "abc-123" |
| **Các bước thực hiện** | 1. Nhấn vào SRS trong danh sách<br>2. Quan sát nội dung hiển thị |
| **Dữ liệu test** | API: `GET /api/v1/srs/get/1/abc-123` |
| **Kết quả mong đợi** | - Hiển thị nội dung SRS dạng Markdown rendered<br>- Bao gồm: Introduction, Scope, Functional Requirements, Non-Functional Requirements<br>- Hiển thị status, generated_at, updated_at |

---

### TC-SRS-009: Cập nhật nội dung SRS {#tc-srs-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa nội dung tài liệu SRS |
| **Điều kiện tiên quyết** | - SRS document_id = "abc-123" đã tạo |
| **Các bước thực hiện** | 1. Mở SRS chi tiết<br>2. Chỉnh sửa nội dung Markdown<br>3. Nhấn "Save" |
| **Dữ liệu test** | API: `PUT /api/v1/srs/update/1/abc-123`<br>Body: `{ content: "# Updated SRS\n...", document_status: "draft" }` |
| **Kết quả mong đợi** | - Nội dung cập nhật thành công<br>- updated_at thay đổi<br>- Hiển thị nội dung mới sau khi lưu |

---

### TC-SRS-010: Cập nhật trạng thái SRS {#tc-srs-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thay đổi trạng thái SRS qua các giá trị hợp lệ |
| **Điều kiện tiên quyết** | - SRS đã tạo với status = "generated" |
| **Các bước thực hiện** | 1. Thay đổi status từ "generated" → "draft"<br>2. Lưu thay đổi<br>3. Thay đổi status từ "draft" → "published"<br>4. Lưu thay đổi |
| **Dữ liệu test** | Status values: `"generated"`, `"draft"`, `"published"`, `"archived"` |
| **Kết quả mong đợi** | - Mỗi giá trị status được chấp nhận và lưu thành công<br>- Badge trạng thái cập nhật tương ứng<br>- Lịch sử thay đổi status được ghi nhận |

---

### TC-SRS-011: Tạo lại SRS (Regenerate) {#tc-srs-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo lại nội dung SRS với mô tả mới |
| **Điều kiện tiên quyết** | - SRS đã tạo (document_id = "abc-123")<br>- Muốn cập nhật với yêu cầu mới |
| **Các bước thực hiện** | 1. Mở SRS chi tiết<br>2. Nhấn nút "Regenerate"<br>3. Nhập mô tả mới: "Thêm module thanh toán trực tuyến"<br>4. Xác nhận regenerate |
| **Dữ liệu test** | API: `PATCH /api/v1/srs/regenerate/1/abc-123`<br>Body: `{ description: "Thêm module thanh toán trực tuyến" }` |
| **Kết quả mong đợi** | - AI tạo lại SRS với nội dung mới<br>- document_id giữ nguyên<br>- Nội dung phản ánh yêu cầu bổ sung<br>- Tạo thêm cặp chat_session mới (user + AI) |

---

### TC-SRS-012: Tự động đặt tên duy nhất khi trùng {#tc-srs-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo nhiều SRS với cùng tên và kiểm tra auto-increment |
| **Điều kiện tiên quyết** | - Dự án đã có SRS tên "SRS Document" |
| **Các bước thực hiện** | 1. Tạo SRS mới (tên sẽ auto-generate)<br>2. Quan sát tên file được lưu |
| **Dữ liệu test** | Tên hiện tại: "SRS Document"<br>Tên mới: "SRS Document (1)" |
| **Kết quả mong đợi** | - Hệ thống tự động thêm suffix (N)<br>- Pattern: "SRS Document" → "SRS Document (1)" → "SRS Document (2)"<br>- Không có xung đột tên file |

---

### TC-SRS-013: SRS của người dùng khác {#tc-srs-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập SRS thuộc sở hữu người dùng khác |
| **Điều kiện tiên quyết** | - Đăng nhập User A<br>- SRS document thuộc User B |
| **Các bước thực hiện** | 1. Gọi API lấy SRS của User B: `GET /api/v1/srs/get/{project_id_B}/{doc_id_B}`<br>2. Quan sát phản hồi |
| **Dữ liệu test** | project_id và document_id thuộc User B |
| **Kết quả mong đợi** | - API trả về lỗi 403 Permission Denied<br>- Không trả về nội dung SRS<br>- Bảo mật dữ liệu giữa các người dùng |

---

### TC-SRS-014: AI service không khả dụng {#tc-srs-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo SRS khi dịch vụ AI gặp sự cố |
| **Điều kiện tiên quyết** | - AI service đang offline hoặc trả lỗi |
| **Các bước thực hiện** | 1. Thực hiện tạo SRS bình thường<br>2. AI service không phản hồi sau 3 lần retry |
| **Dữ liệu test** | AI service URL không khả dụng<br>Retry: 3 lần với backoff exponential (min(2^attempt, 10) + random(0,1) giây) |
| **Kết quả mong đợi** | - Sau 3 lần retry thất bại<br>- API trả về lỗi 502: "AI service unavailable"<br>- Hiển thị thông báo lỗi cho người dùng<br>- Không tạo file rỗng trên Supabase |

---

### TC-SRS-015: Tạo SRS và kiểm tra chat session {#tc-srs-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra cặp chat session được tạo khi generate SRS |
| **Điều kiện tiên quyết** | - Tạo SRS thành công |
| **Các bước thực hiện** | 1. Tạo SRS thành công<br>2. Kiểm tra database bảng Chat_Session |
| **Dữ liệu test** | 2 bản ghi Chat_Session cho mỗi lần generate |
| **Kết quả mong đợi** | - Tạo 2 bản ghi Chat_Session:<br>  1. role="user", message = input_description<br>  2. role="ai", message = JSON stringify AI response<br>- content_type và content_id mapping đúng<br>- project_id và user_id đúng |
