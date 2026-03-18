# Báo Cáo Kiểm Thử - Chức Năng Quy Trình Làm Việc (Workflow)

**Ngày cập nhật**: 12/03/2026  
**Module**: Workflows - Quy trình tạo tài liệu tự động  
**Phiên bản**: 2.0  
**Tổng số test case**: 20

---

## Mục lục

1. [TC-WFL-001: Tạo tài liệu Planning - Stakeholder Register](#tc-wfl-001)
2. [TC-WFL-002: Tạo tài liệu Planning - High Level Requirements](#tc-wfl-002)
3. [TC-WFL-003: Tạo tài liệu Planning - Scope Statement (có phụ thuộc)](#tc-wfl-003)
4. [TC-WFL-004: Tạo tài liệu Planning khi thiếu phụ thuộc bắt buộc](#tc-wfl-004)
5. [TC-WFL-005: Xem danh sách tài liệu Planning](#tc-wfl-005)
6. [TC-WFL-006: Tạo lại tài liệu Planning (Regenerate)](#tc-wfl-006)
7. [TC-WFL-007: Tạo tài liệu Analysis - Feasibility Study](#tc-wfl-007)
8. [TC-WFL-008: Tạo tài liệu Analysis - Cost Benefit](#tc-wfl-008)
9. [TC-WFL-009: Tạo tài liệu Analysis khi thiếu phụ thuộc](#tc-wfl-009)
10. [TC-WFL-010: Tạo tài liệu Design - HLD Architecture](#tc-wfl-010)
11. [TC-WFL-011: Tạo tài liệu Design - LLD Database](#tc-wfl-011)
12. [TC-WFL-012: Xem danh sách tài liệu Design](#tc-wfl-012)
13. [TC-WFL-013: WebSocket Planning - kết nối và nhận sự kiện](#tc-wfl-013)
14. [TC-WFL-014: WebSocket - seq message doc_start → doc_completed](#tc-wfl-014)
15. [TC-WFL-015: WebSocket One-Click flow](#tc-wfl-015)
16. [TC-WFL-016: WebSocket - token không hợp lệ](#tc-wfl-016)
17. [TC-WFL-017: Chain phụ thuộc tài liệu đầy đủ](#tc-wfl-017)
18. [TC-WFL-018: Loại doc_type không hợp lệ](#tc-wfl-018)
19. [TC-WFL-019: Truy cập tài liệu workflow của người khác](#tc-wfl-019)
20. [TC-WFL-020: Cập nhật nội dung tài liệu workflow](#tc-wfl-020)

---

### TC-WFL-001: Tạo tài liệu Planning - Stakeholder Register {#tc-wfl-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo tài liệu Stakeholder Register (không có phụ thuộc) |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Dự án tồn tại (project_id = 1) |
| **Các bước thực hiện** | 1. Truy cập trang Workflows (`/dashboard/project/1/workflows`)<br>2. Chọn phase "Planning"<br>3. Chọn document type: "stakeholder-register"<br>4. Nhập mô tả dự án<br>5. Nhấn "Generate" |
| **Dữ liệu test** | API: `POST /api/v1/planning/generate`<br>Body: `{ project_id: 1, project_name: "E-Commerce", doc_type: "stakeholder-register", description: "Hệ thống thương mại điện tử" }` |
| **Kết quả mong đợi** | - Tài liệu tạo thành công (status 201)<br>- Stakeholder Register không yêu cầu phụ thuộc<br>- File lưu trên Supabase<br>- Tạo 2 Chat_Session records (user + AI) |

---

### TC-WFL-002: Tạo tài liệu Planning - High Level Requirements {#tc-wfl-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo tài liệu High Level Requirements |
| **Điều kiện tiên quyết** | - Dự án tồn tại<br>- Recommended: stakeholder-register (không bắt buộc) |
| **Các bước thực hiện** | 1. Chọn document type: "high-level-requirements"<br>2. Nhập mô tả chi tiết yêu cầu<br>3. Nhấn "Generate" |
| **Dữ liệu test** | doc_type: `"high-level-requirements"` |
| **Kết quả mong đợi** | - Tài liệu tạo thành công<br>- Nếu có stakeholder-register: nội dung phong phú hơn<br>- Nếu không có: hiển thị recommend_documents |

---

### TC-WFL-003: Tạo tài liệu Planning - Scope Statement (có phụ thuộc) {#tc-wfl-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo Scope Statement khi đã có đủ tài liệu phụ thuộc bắt buộc |
| **Điều kiện tiên quyết** | - Đã tạo: business-case, high-level-requirements<br>- Recommended: stakeholder-register |
| **Các bước thực hiện** | 1. Chọn document type: "scope-statement"<br>2. Hệ thống kiểm tra phụ thuộc tự động<br>3. Nhấn "Generate" |
| **Dữ liệu test** | doc_type: `"scope-statement"`<br>Required deps: business-case, high-level-requirements |
| **Kết quả mong đợi** | - Dependency check pass (can_proceed = true)<br>- Tài liệu tạo thành công<br>- AI tham chiếu nội dung business-case và high-level-requirements |

---

### TC-WFL-004: Tạo tài liệu Planning khi thiếu phụ thuộc bắt buộc {#tc-wfl-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo Scope Statement khi thiếu business-case |
| **Điều kiện tiên quyết** | - Chưa tạo business-case<br>- Có high-level-requirements |
| **Các bước thực hiện** | 1. Chọn document type: "scope-statement"<br>2. Nhấn "Generate" |
| **Dữ liệu test** | Thiếu required: `"business-case"` |
| **Kết quả mong đợi** | - API trả về lỗi 422<br>- Message: "Cannot generate scope-statement. Missing required: [business-case]"<br>- Không tạo tài liệu<br>- Hiển thị danh sách tài liệu cần tạo trước |

---

### TC-WFL-005: Xem danh sách tài liệu Planning {#tc-wfl-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem tất cả tài liệu Planning đã tạo |
| **Điều kiện tiên quyết** | - Đã tạo 3 tài liệu: stakeholder-register, high-level-requirements, business-case |
| **Các bước thực hiện** | 1. Truy cập trang Workflows<br>2. Chọn phase "Planning"<br>3. Xem danh sách documents |
| **Dữ liệu test** | API: `GET /api/v1/planning/list/1` |
| **Kết quả mong đợi** | - Hiển thị 3 tài liệu đã tạo<br>- Mỗi item có: title, doc_type, status, ngày tạo<br>- Phân biệt trạng thái tài liệu (generated, draft, published) |

---

### TC-WFL-006: Tạo lại tài liệu Planning (Regenerate) {#tc-wfl-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo lại nội dung tài liệu Planning với mô tả mới |
| **Điều kiện tiên quyết** | - Tài liệu stakeholder-register đã tạo (document_id = "doc-123") |
| **Các bước thực hiện** | 1. Mở chi tiết tài liệu<br>2. Nhấn "Regenerate"<br>3. Nhập mô tả mới<br>4. Xác nhận |
| **Dữ liệu test** | API: `PATCH /api/v1/planning/regenerate/doc-123`<br>Body: `{ description: "Cập nhật danh sách stakeholder mới" }` |
| **Kết quả mong đợi** | - Nội dung được AI tạo lại<br>- document_id giữ nguyên<br>- Tạo thêm cặp chat_session mới<br>- Lịch sử hội thoại tích lũy |

---

### TC-WFL-007: Tạo tài liệu Analysis - Feasibility Study {#tc-wfl-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo Feasibility Study khi đủ phụ thuộc |
| **Điều kiện tiên quyết** | - Đã tạo: business-case, scope-statement, high-level-requirements |
| **Các bước thực hiện** | 1. Chọn phase "Analysis"<br>2. Chọn doc_type: "feasibility-study"<br>3. Nhấn "Generate" |
| **Dữ liệu test** | API: `POST /api/v1/analysis/generate`<br>doc_type: `"feasibility-study"`<br>Required deps: business-case, scope-statement, high-level-requirements |
| **Kết quả mong đợi** | - Dependency check pass<br>- Feasibility Study tạo thành công<br>- AI tham chiếu nội dung 3 tài liệu phụ thuộc |

---

### TC-WFL-008: Tạo tài liệu Analysis - Cost Benefit {#tc-wfl-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo Cost Benefit Analysis |
| **Điều kiện tiên quyết** | - Đã tạo: business-case, feasibility-study, scope-statement |
| **Các bước thực hiện** | 1. Chọn doc_type: "cost-benefit-analysis"<br>2. Nhấn "Generate" |
| **Dữ liệu test** | Required deps: business-case, feasibility-study, scope-statement |
| **Kết quả mong đợi** | - Tài liệu tạo thành công<br>- Nội dung phân tích chi phí-lợi ích dựa trên feasibility study |

---

### TC-WFL-009: Tạo tài liệu Analysis khi thiếu phụ thuộc {#tc-wfl-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo Risk Register khi thiếu feasibility-study |
| **Điều kiện tiên quyết** | - Chưa tạo feasibility-study<br>- Có scope-statement |
| **Các bước thực hiện** | 1. Chọn doc_type: "risk-register"<br>2. Nhấn "Generate" |
| **Dữ liệu test** | Thiếu required: `"feasibility-study"`<br>Risk Register requires: feasibility-study, scope-statement |
| **Kết quả mong đợi** | - API trả về 422<br>- Missing required: ["feasibility-study"]<br>- Hướng dẫn tạo tài liệu phụ thuộc trước |

---

### TC-WFL-010: Tạo tài liệu Design - HLD Architecture {#tc-wfl-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo HLD Architecture document |
| **Điều kiện tiên quyết** | - Đã tạo: srs, feasibility-study, high-level-requirements |
| **Các bước thực hiện** | 1. Chọn phase "Design"<br>2. Chọn doc_type: "hld-arch"<br>3. Nhấn "Generate" |
| **Dữ liệu test** | API: `POST /api/v1/design/generate`<br>doc_type: `"hld-arch"`<br>Required: srs, feasibility-study, high-level-requirements |
| **Kết quả mong đợi** | - HLD Architecture tạo thành công<br>- Nội dung kiến trúc cấp cao dựa trên SRS và feasibility study |

---

### TC-WFL-011: Tạo tài liệu Design - LLD Database {#tc-wfl-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo LLD Database Design |
| **Điều kiện tiên quyết** | - Đã tạo: srs, lld-arch |
| **Các bước thực hiện** | 1. Chọn doc_type: "lld-db"<br>2. Nhấn "Generate" |
| **Dữ liệu test** | Required deps: srs, lld-arch |
| **Kết quả mong đợi** | - LLD Database tạo thành công<br>- Nội dung thiết kế database: bảng, quan hệ, index, ERD |

---

### TC-WFL-012: Xem danh sách tài liệu Design {#tc-wfl-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem tất cả tài liệu Design đã tạo |
| **Điều kiện tiên quyết** | - Đã tạo: hld-arch, hld-cloud, lld-db |
| **Các bước thực hiện** | 1. Chọn phase "Design"<br>2. Xem danh sách documents |
| **Dữ liệu test** | API: `GET /api/v1/design/list/1` |
| **Kết quả mong đợi** | - Hiển thị 3 tài liệu design<br>- Phân biệt loại: HLD vs LLD<br>- Có thể nhấn để xem chi tiết |

---

### TC-WFL-013: WebSocket Planning - kết nối và nhận sự kiện {#tc-wfl-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kết nối WebSocket Planning và nhận streaming events |
| **Điều kiện tiên quyết** | - Đã đăng nhập với token hợp lệ |
| **Các bước thực hiện** | 1. Kết nối WS: `ws://host/api/v1/ws/projects/1/planning?token={token}`<br>2. Gửi payload: `{ project_name, description, documents: [{type: "stakeholder-register"}] }`<br>3. Lắng nghe events |
| **Dữ liệu test** | WS URL: `/api/v1/ws/projects/1/planning?token=valid_jwt`<br>Payload: documents array với 1 document type |
| **Kết quả mong đợi** | - Kết nối WS thành công<br>- Nhận event: `{type: "doc_start", step: "planning", doc_type: "stakeholder-register", index: 0}`<br>- Nhận event: `{type: "doc_completed", step: "planning", doc_type: "stakeholder-register", data: {...}}`<br>- Nhận event: `{type: "step_finished", step: "planning"}` |

---

### TC-WFL-014: WebSocket - seq message doc_start → doc_completed {#tc-wfl-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra thứ tự message WebSocket cho nhiều documents |
| **Điều kiện tiên quyết** | - Kết nối WS thành công |
| **Các bước thực hiện** | 1. Gửi payload với 3 documents: stakeholder-register, high-level-requirements, business-case<br>2. Quan sát thứ tự events |
| **Dữ liệu test** | 3 documents trong payload |
| **Kết quả mong đợi** | - Nhận tuần tự cho mỗi document: doc_start → doc_completed<br>- index tăng: 0, 1, 2<br>- Cuối cùng: step_finished<br>- Không có message xen kẽ sai thứ tự |

---

### TC-WFL-015: WebSocket One-Click flow {#tc-wfl-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Sử dụng One-Click để tạo tất cả tài liệu tự động |
| **Điều kiện tiên quyết** | - Dự án mới chưa có tài liệu nào |
| **Các bước thực hiện** | 1. Kết nối WS: `ws://host/api/v1/ws/generate/1?token={token}`<br>2. Gửi payload với tất cả document types<br>3. Chờ quá trình hoàn tất |
| **Dữ liệu test** | WS One-Click URL: `/api/v1/ws/generate/{project_id}?token={token}`<br>Payload chứa tất cả documents theo đúng thứ tự phụ thuộc |
| **Kết quả mong đợi** | - Tạo tất cả documents theo đúng dependency chain<br>- Planning → Analysis → Design theo thứ tự<br>- Nhận streaming events cho từng document<br>- Cuối cùng: tất cả documents đã tạo |

---

### TC-WFL-016: WebSocket - token không hợp lệ {#tc-wfl-016}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kết nối WebSocket với token hết hạn hoặc không hợp lệ |
| **Điều kiện tiên quyết** | - Token JWT hết hạn hoặc sai |
| **Các bước thực hiện** | 1. Kết nối WS: `ws://host/api/v1/ws/projects/1/planning?token=invalid_token`<br>2. Quan sát kết nối |
| **Dữ liệu test** | Token: `"invalid_or_expired_token"` |
| **Kết quả mong đợi** | - Kết nối WS bị đóng ngay lập tức<br>- Close code: 1008 (Policy Violation)<br>- Không tạo bất kỳ document nào |

---

### TC-WFL-017: Chain phụ thuộc tài liệu đầy đủ {#tc-wfl-017}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chuỗi phụ thuộc đầy đủ từ Planning đến Design |
| **Điều kiện tiên quyết** | - Dự án mới |
| **Các bước thực hiện** | 1. Tạo stakeholder-register (không phụ thuộc)<br>2. Tạo high-level-requirements (recommended: stakeholder-register)<br>3. Tạo business-case<br>4. Tạo scope-statement (requires: business-case, high-level-requirements)<br>5. Tạo feasibility-study (requires: business-case, scope-statement, hlr)<br>6. Tạo srs (requires: hlr, scope-statement, feasibility-study)<br>7. Tạo hld-arch (requires: srs, feasibility-study, hlr) |
| **Dữ liệu test** | 7 tài liệu theo thứ tự phụ thuộc:<br>stakeholder-register → high-level-requirements → business-case → scope-statement → feasibility-study → srs → hld-arch |
| **Kết quả mong đợi** | - Mỗi tài liệu tạo thành công theo đúng thứ tự<br>- Dependency check pass cho mỗi bước<br>- Nếu bỏ qua bước: dependency check fail (422)<br>- Chain hoàn chỉnh từ Planning → Analysis → Design |

---

### TC-WFL-018: Loại doc_type không hợp lệ {#tc-wfl-018}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi request với doc_type không nằm trong danh sách cho phép |
| **Điều kiện tiên quyết** | - Đã đăng nhập |
| **Các bước thực hiện** | 1. Gọi API generate với doc_type không hợp lệ |
| **Dữ liệu test** | doc_type: `"invalid-document"` |
| **Kết quả mong đợi** | - API trả về 400<br>- Message: "Invalid doc_type. Must be one of: [danh sách]"<br>- Không tạo file |

---

### TC-WFL-019: Truy cập tài liệu workflow của người khác {#tc-wfl-019}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập tài liệu workflow thuộc dự án của người dùng khác |
| **Điều kiện tiên quyết** | - Đăng nhập User A<br>- Document thuộc User B |
| **Các bước thực hiện** | 1. Gọi API lấy tài liệu của User B |
| **Dữ liệu test** | project_id thuộc User B |
| **Kết quả mong đợi** | - API trả về 403 Forbidden<br>- Không trả về nội dung tài liệu |

---

### TC-WFL-020: Cập nhật nội dung tài liệu workflow {#tc-wfl-020}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Chỉnh sửa nội dung tài liệu đã tạo trong workflow |
| **Điều kiện tiên quyết** | - Tài liệu stakeholder-register đã tạo |
| **Các bước thực hiện** | 1. Mở chi tiết tài liệu<br>2. Chỉnh sửa nội dung Markdown<br>3. Nhấn "Save" |
| **Dữ liệu test** | Nội dung mới: "# Updated Stakeholder Register\n..." |
| **Kết quả mong đợi** | - Nội dung cập nhật thành công<br>- updated_at thay đổi<br>- Hiển thị nội dung mới |
