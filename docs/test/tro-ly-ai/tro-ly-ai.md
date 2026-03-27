# Báo Cáo Kiểm Thử - Chức Năng Trợ Lý AI (AI Conversations)

**Ngày cập nhật**: 12/03/2026  
**Module**: AI Conversations - Trợ lý AI hội thoại  
**Phiên bản**: 2.0  
**Tổng số test case**: 12

---

## Mục lục

1. [TC-AI-001: Gửi tin nhắn và nhận phản hồi AI](#tc-ai-001)
2. [TC-AI-002: Hiển thị gợi ý ban đầu](#tc-ai-002)
3. [TC-AI-003: Nhấn gợi ý để gửi tin nhắn](#tc-ai-003)
4. [TC-AI-004: Xem lịch sử hội thoại](#tc-ai-004)
5. [TC-AI-005: Lịch sử hội thoại tích lũy qua regenerate](#tc-ai-005)
6. [TC-AI-006: Sidebar danh sách hội thoại](#tc-ai-006)
7. [TC-AI-007: Chuyển đổi giữa các hội thoại](#tc-ai-007)
8. [TC-AI-008: Gửi tin nhắn rỗng](#tc-ai-008)
9. [TC-AI-009: Hiển thị trạng thái loading khi AI đang xử lý](#tc-ai-009)
10. [TC-AI-010: Markdown rendering trong phản hồi AI](#tc-ai-010)
11. [TC-AI-011: Truy cập AI Conversations khi chưa đăng nhập](#tc-ai-011)
12. [TC-AI-012: AI phản hồi lỗi hoặc timeout](#tc-ai-012)

---

### TC-AI-001: Gửi tin nhắn và nhận phản hồi AI {#tc-ai-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Gửi tin nhắn và nhận phản hồi từ AI |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Đang ở trang AI Conversations (`/dashboard/project/1/aiconversations`) |
| **Các bước thực hiện** | 1. Nhập tin nhắn vào ChatInput: "Giúp tôi viết yêu cầu cho module đăng nhập"<br>2. Nhấn nút Send hoặc Enter<br>3. Chờ AI phản hồi |
| **Dữ liệu test** | Message: `"Giúp tôi viết yêu cầu cho module đăng nhập"` |
| **Kết quả mong đợi** | - Tin nhắn user hiển thị trong ChatMessages (role="user")<br>- AI phản hồi hiển thị bên dưới (role="ai")<br>- Phản hồi có nội dung liên quan đến yêu cầu module đăng nhập<br>- Tin nhắn lưu vào Chat_Session database |

---

### TC-AI-002: Hiển thị gợi ý ban đầu {#tc-ai-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hiển thị các gợi ý nhanh khi chưa có hội thoại |
| **Điều kiện tiên quyết** | - Mở trang AI Conversations lần đầu (messages.length === 1) |
| **Các bước thực hiện** | 1. Truy cập trang AI Conversations<br>2. Quan sát phần gợi ý |
| **Dữ liệu test** | 4 gợi ý mặc định |
| **Kết quả mong đợi** | - Hiển thị 4 gợi ý nhanh:<br>  1. "Generate an SRS document for an e-commerce platform"<br>  2. "Create a user flow diagram for login"<br>  3. "Design a wireframe for a dashboard"<br>  4. "Explain the requirements gathering process"<br>- Gợi ý biến mất sau khi bắt đầu hội thoại |

---

### TC-AI-003: Nhấn gợi ý để gửi tin nhắn {#tc-ai-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhấn vào gợi ý nhanh để tự động gửi tin nhắn |
| **Điều kiện tiên quyết** | - Gợi ý đang hiển thị (chưa có hội thoại) |
| **Các bước thực hiện** | 1. Nhấn vào gợi ý: "Generate an SRS document for an e-commerce platform"<br>2. Quan sát ChatInput và chat flow |
| **Dữ liệu test** | Suggestion: `"Generate an SRS document for an e-commerce platform"` |
| **Kết quả mong đợi** | - Nội dung gợi ý được gửi như tin nhắn user<br>- AI phản hồi tương ứng<br>- Các gợi ý khác biến mất |

---

### TC-AI-004: Xem lịch sử hội thoại {#tc-ai-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xem lịch sử tin nhắn của một document/conversation |
| **Điều kiện tiên quyết** | - Đã tạo SRS (content_id = "srs-123")<br>- Có lịch sử hội thoại |
| **Các bước thực hiện** | 1. Chọn conversation liên quan đến SRS trong sidebar<br>2. Quan sát danh sách tin nhắn |
| **Dữ liệu test** | API: `GET /api/v1/sessions/list/srs-123`<br>Response: array of Chat_Session records |
| **Kết quả mong đợi** | - Hiển thị lịch sử tin nhắn theo thứ tự thời gian<br>- Tin nhắn user và AI xen kẽ đúng<br>- Mỗi tin nhắn có: role, message, timestamp |

---

### TC-AI-005: Lịch sử hội thoại tích lũy qua regenerate {#tc-ai-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra lịch sử tích lũy khi regenerate tài liệu nhiều lần |
| **Điều kiện tiên quyết** | - Đã tạo SRS 1 lần, regenerate 2 lần |
| **Các bước thực hiện** | 1. Tạo SRS (2 chat_session: user + AI)<br>2. Regenerate lần 1 (thêm 2 chat_session)<br>3. Regenerate lần 2 (thêm 2 chat_session)<br>4. Xem lịch sử hội thoại |
| **Dữ liệu test** | 3 lần generate → 6 bản ghi Chat_Session |
| **Kết quả mong đợi** | - Hiển thị 6 tin nhắn (3 user + 3 AI)<br>- Thứ tự thời gian chính xác<br>- Có thể theo dõi sự thay đổi qua các lần regenerate |

---

### TC-AI-006: Sidebar danh sách hội thoại {#tc-ai-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hiển thị danh sách tất cả hội thoại trong ConversationSidebar |
| **Điều kiện tiên quyết** | - Đã tạo SRS, Diagram, Wireframe (mỗi cái có conversation) |
| **Các bước thực hiện** | 1. Quan sát ConversationSidebar bên trái<br>2. Kiểm tra danh sách conversations |
| **Dữ liệu test** | 3 conversations: SRS, Diagram, Wireframe |
| **Kết quả mong đợi** | - Sidebar hiển thị 3 conversations<br>- Mỗi item có: title, content_type, last message preview<br>- Conversation active được highlight |

---

### TC-AI-007: Chuyển đổi giữa các hội thoại {#tc-ai-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Nhấn chuyển giữa các conversation khác nhau |
| **Điều kiện tiên quyết** | - Có ít nhất 2 conversations |
| **Các bước thực hiện** | 1. Đang xem conversation SRS<br>2. Nhấn vào conversation Diagram trong sidebar<br>3. Quan sát nội dung chat thay đổi |
| **Dữ liệu test** | Chuyển từ content_id SRS sang content_id Diagram |
| **Kết quả mong đợi** | - Nội dung chat thay đổi sang lịch sử của Diagram<br>- Conversation Diagram được highlight trong sidebar<br>- Không mất dữ liệu conversation trước |

---

### TC-AI-008: Gửi tin nhắn rỗng {#tc-ai-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Thử gửi tin nhắn khi input rỗng |
| **Điều kiện tiên quyết** | - Đang ở trang AI Conversations |
| **Các bước thực hiện** | 1. Để trống ô ChatInput<br>2. Nhấn nút Send hoặc Enter |
| **Dữ liệu test** | Message: `""` (rỗng) |
| **Kết quả mong đợi** | - Không gửi tin nhắn<br>- Nút Send bị vô hiệu hóa khi input rỗng<br>- Không có request API |

---

### TC-AI-009: Hiển thị trạng thái loading khi AI đang xử lý {#tc-ai-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra loading state trong khi chờ AI phản hồi |
| **Điều kiện tiên quyết** | - Gửi tin nhắn hợp lệ |
| **Các bước thực hiện** | 1. Gửi tin nhắn "Giải thích quy trình phân tích yêu cầu"<br>2. Quan sát trạng thái UI trong khi chờ |
| **Dữ liệu test** | AI xử lý mất vài giây |
| **Kết quả mong đợi** | - Hiển thị loading indicator (typing animation hoặc spinner)<br>- Nút Send bị disabled trong khi chờ<br>- Input field không cho nhập thêm (hoặc vẫn cho nhập)<br>- Loading biến mất khi AI phản hồi |

---

### TC-AI-010: Markdown rendering trong phản hồi AI {#tc-ai-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra phản hồi AI hiển thị Markdown đúng format |
| **Điều kiện tiên quyết** | - AI trả về phản hồi chứa Markdown formatting |
| **Các bước thực hiện** | 1. Gửi yêu cầu tạo danh sách yêu cầu<br>2. Quan sát format phản hồi |
| **Dữ liệu test** | AI response chứa: headings, bullet lists, code blocks, bold/italic |
| **Kết quả mong đợi** | - Headings (#, ##, ###) render đúng kích thước<br>- Bullet lists hiển thị dạng danh sách<br>- Code blocks có highlight và background<br>- Bold/italic hiển thị đúng |

---

### TC-AI-011: Truy cập AI Conversations khi chưa đăng nhập {#tc-ai-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Truy cập trang AI Conversations mà không có token |
| **Điều kiện tiên quyết** | - Chưa đăng nhập |
| **Các bước thực hiện** | 1. Truy cập URL `/dashboard/project/1/aiconversations` |
| **Dữ liệu test** | Không có access token |
| **Kết quả mong đợi** | - Middleware redirect về `/login`<br>- Không hiển thị nội dung conversation |

---

### TC-AI-012: AI phản hồi lỗi hoặc timeout {#tc-ai-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xử lý khi AI service gặp lỗi hoặc timeout |
| **Điều kiện tiên quyết** | - AI service đang quá tải hoặc offline |
| **Các bước thực hiện** | 1. Gửi tin nhắn khi AI service không khả dụng<br>2. Quan sát xử lý lỗi |
| **Dữ liệu test** | AI service timeout hoặc trả về 500 |
| **Kết quả mong đợi** | - Hiển thị thông báo lỗi thân thiện<br>- Loading indicator dừng<br>- Cho phép người dùng thử lại<br>- Không crash ứng dụng |
