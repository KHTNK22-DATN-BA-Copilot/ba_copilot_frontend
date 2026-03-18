# Báo Cáo Kiểm Thử - Chức Năng Chatbot Tích Hợp

**Ngày cập nhật**: 12/03/2026  
**Module**: Chatbot - Trợ lý AI nội tuyến  
**Phiên bản**: 2.0  
**Tổng số test case**: 10

---

## Mục lục

1. [TC-CB-001: Mở chatbot từ nút floating](#tc-cb-001)
2. [TC-CB-002: Đóng chatbot](#tc-cb-002)
3. [TC-CB-003: Gửi yêu cầu cập nhật tài liệu](#tc-cb-003)
4. [TC-CB-004: Nhận phản hồi AI và cập nhật nội dung](#tc-cb-004)
5. [TC-CB-005: Gửi tin nhắn rỗng trong chatbot](#tc-cb-005)
6. [TC-CB-006: Loading state trong chatbot](#tc-cb-006)
7. [TC-CB-007: Markdown rendering trong chatbot](#tc-cb-007)
8. [TC-CB-008: ChatWithAI - cấu hình API tùy chỉnh](#tc-cb-008)
9. [TC-CB-009: Chatbot trên Wireframe Overview](#tc-cb-009)
10. [TC-CB-010: Xử lý lỗi API trong chatbot](#tc-cb-010)

---

### TC-CB-001: Mở chatbot từ nút floating {#tc-cb-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Mở cửa sổ chatbot bằng nút floating button |
| **Điều kiện tiên quyết** | - Đang ở trang có ChatBot component (VD: SRS detail) |
| **Các bước thực hiện** | 1. Tìm nút floating của chatbot (góc dưới phải)<br>2. Nhấn vào nút |
| **Dữ liệu test** | Props: `assisstanceName`, `projectId`, `documentId` |
| **Kết quả mong đợi** | - Cửa sổ chat mở lên<br>- Hiển thị tên trợ lý (assisstanceName)<br>- Input field sẵn sàng nhập<br>- Lịch sử hội thoại trước đó (nếu có) được hiển thị |

---

### TC-CB-002: Đóng chatbot {#tc-cb-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đóng cửa sổ chatbot |
| **Điều kiện tiên quyết** | - Chatbot đang mở |
| **Các bước thực hiện** | 1. Nhấn nút đóng (X) trên chatbot<br>2. Quan sát UI |
| **Dữ liệu test** | Không áp dụng |
| **Kết quả mong đợi** | - Cửa sổ chat đóng lại<br>- Nút floating vẫn hiển thị<br>- Nhấn lại mở chatbot với trạng thái trước đó |

---

### TC-CB-003: Gửi yêu cầu cập nhật tài liệu {#tc-cb-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi yêu cầu để AI regenerate/cập nhật tài liệu qua chatbot |
| **Điều kiện tiên quyết** | - Chatbot đang mở trên trang SRS detail<br>- projectId = 1, documentId = "srs-123" |
| **Các bước thực hiện** | 1. Nhập: "Thêm yêu cầu bảo mật cho module thanh toán"<br>2. Nhấn Send |
| **Dữ liệu test** | API: `PATCH /api/srs-generate/doc`<br>FormData: `projectId=1, documentId=srs-123, description="Thêm yêu cầu bảo mật cho module thanh toán"` |
| **Kết quả mong đợi** | - Request gửi thành công<br>- AI xử lý và trả về nội dung cập nhật<br>- Tin nhắn user hiển thị trong chat window<br>- Phản hồi AI hiển thị bên dưới |

---

### TC-CB-004: Nhận phản hồi AI và cập nhật nội dung {#tc-cb-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra callback onContentUpdate sau khi AI phản hồi |
| **Điều kiện tiên quyết** | - Đã gửi request regenerate thành công |
| **Các bước thực hiện** | 1. Gửi yêu cầu qua chatbot<br>2. Chờ AI phản hồi<br>3. Kiểm tra nội dung tài liệu gốc có cập nhật |
| **Dữ liệu test** | Callback: `onContentUpdate(newContent)` |
| **Kết quả mong đợi** | - Phản hồi AI hiển thị trong chatbot<br>- Callback onContentUpdate được gọi<br>- Nội dung tài liệu (SRS/Wireframe) cập nhật theo phản hồi AI<br>- Không cần tải lại trang |

---

### TC-CB-005: Gửi tin nhắn rỗng trong chatbot {#tc-cb-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thử gửi tin nhắn rỗng trong chatbot |
| **Điều kiện tiên quyết** | - Chatbot đang mở |
| **Các bước thực hiện** | 1. Để trống input<br>2. Nhấn Send |
| **Dữ liệu test** | Message: `""` |
| **Kết quả mong đợi** | - Không gửi request API<br>- Nút Send disabled khi input rỗng<br>- Không thêm tin nhắn rỗng vào lịch sử |

---

### TC-CB-006: Loading state trong chatbot {#tc-cb-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra trạng thái loading khi chờ AI phản hồi |
| **Điều kiện tiên quyết** | - Gửi request hợp lệ |
| **Các bước thực hiện** | 1. Gửi tin nhắn<br>2. Quan sát trạng thái UI trong khi chờ |
| **Dữ liệu test** | AI đang xử lý (mất vài giây) |
| **Kết quả mong đợi** | - Hiển thị loading indicator<br>- Input bị disable trong khi chờ<br>- Nút Send chuyển sang trạng thái loading<br>- Loading dừng khi nhận phản hồi |

---

### TC-CB-007: Markdown rendering trong chatbot {#tc-cb-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra Markdown rendering trong phản hồi chatbot |
| **Điều kiện tiên quyết** | - AI trả về phản hồi có Markdown |
| **Các bước thực hiện** | 1. Gửi yêu cầu<br>2. AI trả về phản hồi chứa Markdown<br>3. Kiểm tra rendering |
| **Dữ liệu test** | Response chứa: `# Heading`, `- list item`, `**bold**`, `` `code` `` |
| **Kết quả mong đợi** | - Markdown được render đúng (không hiển thị raw text)<br>- Headings, lists, bold, code hiển thị đúng format<br>- Link clickable nếu có |

---

### TC-CB-008: ChatWithAI - cấu hình API tùy chỉnh {#tc-cb-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra ChatWithAI component với config API tùy chỉnh |
| **Điều kiện tiên quyết** | - ChatWithAI được sử dụng trong Wireframe Overview |
| **Các bước thực hiện** | 1. Mở trang Wireframe detail<br>2. Sử dụng ChatWithAI để yêu cầu cập nhật wireframe<br>3. Kiểm tra API endpoint được gọi |
| **Dữ liệu test** | Config: custom API URL, custom success callback |
| **Kết quả mong đợi** | - ChatWithAI gọi đúng API endpoint theo config<br>- Success callback được gọi khi thành công<br>- Error callback được gọi khi lỗi |

---

### TC-CB-009: Chatbot trên Wireframe Overview {#tc-cb-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra chatbot tích hợp trong trang Wireframe Overview |
| **Điều kiện tiên quyết** | - Đang ở trang WireframeOverview<br>- Màn hình lg+ (desktop) |
| **Các bước thực hiện** | 1. Mở Wireframe detail trên desktop<br>2. Kiểm tra ChatWithAI hiển thị bên phải<br>3. Thu nhỏ browser về mobile size<br>4. Kiểm tra chat bị ẩn |
| **Dữ liệu test** | Desktop: lg+ (≥1024px), Mobile: < 1024px |
| **Kết quả mong đợi** | - Desktop (lg+): ChatWithAI hiển thị bên phải wireframe preview<br>- Mobile: ChatWithAI bị ẩn (hidden)<br>- Layout responsive phù hợp |

---

### TC-CB-010: Xử lý lỗi API trong chatbot {#tc-cb-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xử lý khi API regenerate trả về lỗi |
| **Điều kiện tiên quyết** | - Chatbot đang mở<br>- Server hoặc AI service gặp lỗi |
| **Các bước thực hiện** | 1. Gửi yêu cầu qua chatbot<br>2. API trả về lỗi 500 |
| **Dữ liệu test** | API response: status 500 |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi trong chat window<br>- Loading indicator dừng<br>- Nội dung tài liệu gốc không bị thay đổi<br>- Cho phép người dùng thử lại |
