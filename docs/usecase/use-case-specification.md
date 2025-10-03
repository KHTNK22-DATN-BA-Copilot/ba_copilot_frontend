# BA Copilot Frontend - Đặc Tả Use Case

## Thông Tin Tài Liệu

**Tên Dự Án**: BA Copilot Frontend  
**Phiên Bản**: 1.0.0  
**Ngày Tạo**: Tháng 9, 2025  
**Cập Nhật Lần Cuối**: 3 Tháng 10, 2025  
**Tác Giả**: Team BA Copilot Frontend  
**Trạng Thái**: Đang Phát Triển (Sprint 2)

---

## 📋 Tổng Quan Dự Án

### Mô Tả Hệ Thống

BA Copilot Frontend là giao diện người dùng cho hệ thống AI hỗ trợ phân tích kinh doanh (Business Analysis). Hệ thống cung cấp các công cụ thông minh để:

-   Tạo tài liệu SRS (Software Requirements Specification)
-   Thiết kế wireframe từ mô tả
-   Tương tác với AI để hỗ trợ quá trình phân tích kinh doanh
-   Quản lý dự án và cộng tác nhóm

### Đối Tượng Người Dùng

-   **Business Analyst**: Người phân tích kinh doanh chuyên nghiệp
-   **Product Manager**: Quản lý sản phẩm
-   **Project Manager**: Quản lý dự án
-   **UI/UX Designer**: Nhà thiết kế giao diện
-   **Stakeholder**: Các bên liên quan trong dự án
-   **Developer**: Lập trình viên cần hiểu yêu cầu

### Phạm Vi MVP (Đến 11/11/2025)

1. Hệ thống xác thực hoàn chỉnh
2. Dashboard responsive với analytics
3. SRS Generator với AI integration
4. Wireframe Generator với drag-and-drop
5. AI Chat Interface
6. Quản lý Profile người dùng
7. Responsive layout cho tất cả devices

---

## 🔐 NHÓM USE CASE 1: XÁC THỰC VÀ QUẢN LÝ TÀI KHOẢN

### UC001: Đăng Ký Tài Khoản

**Mô Tả**: Người dùng mới tạo tài khoản để truy cập hệ thống BA Copilot.

**Actor Chính**: Người dùng chưa có tài khoản

**Điều Kiện Tiên Quyết**:

-   Người dùng có kết nối internet
-   Hệ thống backend hoạt động bình thường

**Luồng Sự Kiện Chính**:

1. Người dùng truy cập trang đăng ký `/register`
2. Hệ thống hiển thị form đăng ký với các trường:
    - Họ và tên (bắt buộc, tối thiểu 2 ký tự)
    - Email (bắt buộc, định dạng email hợp lệ)
    - Mật khẩu (bắt buộc, theo quy tắc bảo mật)
    - Xác nhận mật khẩu (bắt buộc, phải khớp)
3. Người dùng nhập thông tin vào form
4. Hệ thống validate real-time:
    - Kiểm tra độ mạnh mật khẩu (8+ ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt)
    - Hiển thị indicator khớp mật khẩu
    - Validate định dạng email
5. Người dùng nhấn "Tạo Tài Khoản"
6. Hệ thống gửi request đến backend API
7. Backend tạo tài khoản và gửi email xác thực
8. Hệ thống chuyển hướng đến trang verify-email với email parameter
9. Người dùng nhận email xác thực

**Luồng Thay Thế**:

-   **3a**: Nếu email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
-   **4a**: Nếu mật khẩu không đủ mạnh → Hiển thị yêu cầu cụ thể chưa đạt
-   **6a**: Nếu lỗi mạng → Hiển thị "Lỗi kết nối, vui lòng thử lại"

**Kết Quả**:

-   Tài khoản được tạo với trạng thái chưa xác thực
-   Email xác thực được gửi
-   Người dùng được chuyển đến trang xác thực email

**Tần Suất Sử Dụng**: Thường xuyên

---

### UC002: Xác Thực Email

**Mô Tả**: Người dùng xác thực email sau khi đăng ký để kích hoạt tài khoản.

**Actor Chính**: Người dùng đã đăng ký

**Điều Kiện Tiên Quyết**:

-   Đã hoàn thành UC001 (Đăng ký tài khoản)
-   Email xác thực đã được gửi

**Luồng Sự Kiện Chính**:

1. Người dùng ở trang `/verify-email` với email parameter
2. Hệ thống hiển thị:
    - Thông báo email đã gửi đến địa chỉ cụ thể
    - Form nhập mã PIN (6 chữ số)
    - Nút "Gửi lại mã" (disabled 60 giây đầu)
3. Người dùng nhập mã PIN từ email
4. Hệ thống validate format PIN (6 chữ số)
5. Người dùng nhấn "Xác thực"
6. Hệ thống gửi request verify đến backend
7. Backend xác thực mã PIN
8. Hệ thống chuyển hướng đến `/verify-success`
9. Hiển thị thông báo thành công và chuyển hướng sang trang Login.

**Luồng Thay Thế**:

-   **3a**: Mã PIN sai → Hiển thị "Mã xác thực không đúng"
-   **3b**: Mã PIN hết hạn → Hiển thị "Mã đã hết hạn, vui lòng gửi lại"
-   **2a**: Gửi lại mã → Reset countdown 60 giây, gửi email mới

**Kết Quả**:

-   Tài khoản được kích hoạt
-   Người dùng có thể đăng nhập

**Tần Suất Sử Dụng**: Một lần cho mỗi tài khoản

---

### UC003: Đăng Nhập

**Mô Tả**: Người dùng đăng nhập vào hệ thống để sử dụng các tính năng.

**Actor Chính**: Người dùng đã có tài khoản

**Điều Kiện Tiên Quyết**:

-   Tài khoản đã được kích hoạt
-   Người dùng nhớ thông tin đăng nhập

**Luồng Sự Kiện Chính**:

1. Người dùng truy cập trang đăng nhập `/login`
2. Hệ thống hiển thị form đăng nhập:
    - Email/Username
    - Mật khẩu
    - Checkbox "Ghi nhớ đăng nhập"
    - Link "Quên mật khẩu?"
    - Nút "Đăng nhập với Google"
3. Người dùng nhập thông tin đăng nhập
4. Người dùng nhấn "Đăng nhập"
5. Hệ thống gửi request đến `/api/login`
6. Backend xác thực thông tin
7. Backend trả về access token
8. Hệ thống lưu token vào HTTP-only cookie
9. Chuyển hướng đến `/dashboard`

**Luồng Thay Thế**:

-   **3a**: Thông tin sai → Hiển thị "Email hoặc mật khẩu không đúng"
-   **3b**: Tài khoản chưa kích hoạt → Chuyển đến trang verify-email
-   **2a**: Đăng nhập Google → Chuyển đến OAuth flow

**Kết Quả**:

-   Người dùng được xác thực
-   Session được tạo
-   Chuyển đến dashboard

**Tần Suất Sử Dụng**: Rất thường xuyên

---

### UC004: Quên Mật Khẩu

**Mô Tả**: Người dùng đặt lại mật khẩu khi không nhớ mật khẩu cũ.

**Actor Chính**: Người dùng quên mật khẩu

**Điều Kiện Tiên Quyết**:

-   Có tài khoản trong hệ thống
-   Có quyền truy cập email đăng ký

**Luồng Sự Kiện Chính**:

1. Người dùng click "Quên mật khẩu?" từ trang login
2. Chuyển đến `/forgot-password`
3. Hiển thị form nhập email
4. Người dùng nhập email và nhấn "Gửi mã"
5. Hệ thống gửi OTP đến email
6. Chuyển đến form nhập OTP
7. Người dùng nhập OTP từ email
8. Sau khi OTP đúng, hiển thị form đặt mật khẩu mới
9. Người dùng nhập mật khẩu mới (với validation)
10. Xác nhận đổi mật khẩu thành công
11. Chuyển đến trang đăng nhập

**Luồng Thay Thế**:

-   **4a**: Email không tồn tại → "Email không tìm thấy trong hệ thống"
-   **7a**: OTP sai/hết hạn → "Mã OTP không đúng hoặc đã hết hạn"

**Kết Quả**:

-   Mật khẩu được cập nhật
-   Người dùng có thể đăng nhập với mật khẩu mới

---

### UC005: Đăng Xuất

**Mô Tả**: Người dùng kết thúc phiên làm việc và đăng xuất khỏi hệ thống.

**Actor Chính**: Người dùng đã đăng nhập

**Điều Kiện Tiên Quyết**:

-   Người dùng đang trong phiên đăng nhập

**Luồng Sự Kiện Chính**:

1. Người dùng click vào avatar ở góc phải header
2. Dropdown menu hiển thị với options:
    - Account Settings
    - Logout
3. Người dùng click "Logout"
4. Hệ thống gọi API backend logout (nếu có token)
5. Xóa tất cả data authentication từ localStorage và sessionStorage
6. Reset theme về light mode
7. Đóng dropdown menu
8. Chuyển hướng về `/login`

**Luồng Thay Thế**:

-   **4a**: API logout fail → Vẫn tiếp tục logout local
-   **4b**: Không có token → Chỉ clean up local storage

**Kết Quả**:

-   Session kết thúc
-   User data được xóa
-   Chuyển về trang login

---

## 👤 NHÓM USE CASE 2: QUẢN LÝ PROFILE NGƯỜI DÙNG

### UC006: Xem Thông Tin Profile

**Mô Tả**: Người dùng xem thông tin cá nhân của mình.

**Actor Chính**: Người dùng đã đăng nhập

**Điều Kiện Tiên Quyết**:

-   Đã đăng nhập vào hệ thống

**Luồng Sự Kiện Chính**:

1. Người dùng truy cập `/dashboard/accountsetting`
2. Hệ thống load thông tin user từ API `/api/me`
3. Hiển thị form profile với các trường:
    - Avatar (có thể upload)
    - Họ và tên
    - Email (readonly)
    - Số điện thoại
    - Công ty/Tổ chức
    - Vị trí công việc
    - Ngày tham gia
    - Thống kê sử dụng
4. Hiển thị các section:
    - Thông tin cá nhân
    - Cài đặt bảo mật
    - Preferences
    - Thống kê hoạt động

**Kết Quả**:

-   Thông tin profile được hiển thị đầy đủ
-   Người dùng có thể xem các thống kê cá nhân

---

### UC007: Chỉnh Sửa Profile

**Mô Tả**: Người dùng cập nhật thông tin cá nhân.

**Actor Chính**: Người dùng đã đăng nhập

**Điều Kiện Tiên Quyết**:

-   Đang xem trang profile (UC006)

**Luồng Sự Kiện Chính**:

1. Người dùng click nút "Chỉnh sửa" trên các field
2. Field chuyển sang chế độ editable
3. Người dùng nhập thông tin mới
4. Hệ thống validate real-time (format, độ dài)
5. Người dùng click "Lưu" hoặc "Hủy"
6. Nếu "Lưu": gửi API update profile
7. Hiển thị loading state
8. Thông báo thành công/thất bại
9. Refresh thông tin mới

**Luồng Thay Thế**:

-   **3a**: Input không hợp lệ → Hiển thị lỗi validation
-   **6a**: API error → Hiển thị "Lỗi cập nhật, vui lòng thử lại"

**Kết Quả**:

-   Thông tin profile được cập nhật
-   Database được sync

---

### UC008: Đổi Mật Khẩu

**Mô Tả**: Người dùng thay đổi mật khẩu từ trang profile.

**Actor Chính**: Người dùng đã đăng nhập

**Luồng Sự Kiện Chính**:

1. Từ trang profile, click "Đổi mật khẩu"
2. Hiển thị modal/form với các trường:
    - Mật khẩu hiện tại
    - Mật khẩu mới
    - Xác nhận mật khẩu mới
3. Validate mật khẩu mới theo quy tắc bảo mật
4. Người dùng submit form
5. Xác thực mật khẩu hiện tại với backend
6. Cập nhật mật khẩu mới
7. Thông báo thành công
8. Optional: Đăng xuất tất cả sessions khác

**Kết Quả**:

-   Mật khẩu được cập nhật
-   Bảo mật tài khoản được tăng cường

---

## 📊 NHÓM USE CASE 3: DASHBOARD VÀ ANALYTICS

### UC009: Xem Dashboard Tổng Quan

**Mô Tả**: Người dùng xem trang chính với tổng quan hoạt động và thống kê.

**Actor Chính**: Người dùng đã đăng nhập

**Điều Kiện Tiên Quyết**:

-   Đã đăng nhập thành công

**Luồng Sự Kiện Chính**:

1. Sau khi đăng nhập, chuyển đến `/dashboard`
2. Hệ thống load dữ liệu từ múltiple APIs:
    - User statistics
    - Recent projects
    - System analytics
    - Quick actions
3. Hiển thị layout với:
    - Sidebar navigation (responsive)
    - Header với search và user actions
    - Main content area với widgets:
        - Overview statistics
        - Recent projects
        - Quick actions (Tạo SRS, Tạo Wireframe)
        - Activity timeline
4. Load charts và visualizations
5. Setup real-time updates (nếu có)

**Tính Năng Responsive**:

-   Desktop: Full sidebar + content
-   Tablet: Collapsible sidebar
-   Mobile: Overlay sidebar với hamburger menu

**Kết Quả**:

-   Dashboard hiển thị đầy đủ thông tin
-   Navigation hoạt động responsive
-   Quick actions sẵn sàng

---

### UC010: Tìm Kiếm Global

**Mô Tả**: Người dùng tìm kiếm nội dung across toàn bộ hệ thống.

**Actor Chính**: Người dùng đã đăng nhập

**Luồng Sự Kiện Chính**:

1. Người dùng click vào search box ở header
2. Nhập keyword
3. Hệ thống search real-time với debounce
4. Hiển thị dropdown results với categories:
    - Projects
    - SRS Documents
    - Wireframes
    - AI Conversations
5. Người dùng click vào result hoặc "Xem tất cả"
6. Chuyển đến trang/item tương ứng

**Kết Quả**:

-   Tìm thấy nội dung liên quan
-   Quick navigation đến nội dung

---

## 📝 NHÓM USE CASE 4: SRS GENERATOR

### UC011: Tạo Tài Liệu SRS Mới

**Mô Tả**: Người dùng tạo tài liệu Software Requirements Specification với sự hỗ trợ của AI.

**Actor Chính**: Business Analyst, Product Manager

**Điều Kiện Tiên Quyết**:

-   Đã đăng nhập vào hệ thống
-   Có hiểu biết cơ bản về SRS

**Luồng Sự Kiện Chính**:

1. Người dùng truy cập `/dashboard/srsgenerator` hoặc click "Tạo SRS" từ dashboard
2. Hệ thống hiển thị wizard multi-step:

    **Step 1: Thông tin Dự án**

    - Tên dự án
    - Mô tả ngắn
    - Loại dự án (Web, Mobile, Desktop, etc.)
    - Industry/Domain

    **Step 2: Yêu cầu Functional**

    - Mô tả tính năng chính
    - User stories
    - Business rules
    - AI suggestion dựa trên input

    **Step 3: Yêu cầu Non-functional**

    - Performance requirements
    - Security requirements
    - Scalability needs
    - Compliance requirements

    **Step 4: Technical Constraints**

    - Technology stack preferences
    - Integration requirements
    - Environment constraints

3. Sau mỗi step, AI phân tích và suggest improvements
4. Người dùng review và finalize inputs
5. Click "Tạo SRS"
6. AI generates complete SRS document
7. Hiển thị preview với sections:
    - Introduction
    - Overall Description
    - System Features
    - External Interface Requirements
    - Non-functional Requirements
    - Appendices

**Luồng Thay Thế**:

-   **3a**: AI suggestion không phù hợp → User có thể ignore và continue
-   **6a**: Generation failed → Retry với simplified inputs
-   **2a**: Sử dụng template có sẵn thay vì wizard

**Kết Quả**:

-   SRS document hoàn chỉnh được tạo
-   Document được lưu vào library
-   Có thể export multiple formats

---

### UC012: Chỉnh Sửa SRS

**Mô Tả**: Người dùng chỉnh sửa tài liệu SRS đã tồn tại.

**Actor Chính**: Business Analyst, Product Manager

**Luồng Sự Kiện Chính**:

1. Từ SRS library, click "Chỉnh sửa" trên document
2. Mở SRS editor với:
    - Live preview pane
    - Section-based editing
    - Rich text editor
    - AI assistant panel
3. Người dùng edit content:
    - Click vào section để edit
    - Sử dụng rich text tools
    - Thêm/xóa sections
    - Insert tables, diagrams
4. AI assistant đề xuất improvements real-time
5. Auto-save mỗi 30 giây
6. Click "Lưu" để finalize changes
7. Update version history

**Tính Năng Đặc Biệt**:

-   Collaborative editing (nếu shared)
-   Comment system
-   Track changes
-   AI proofreading

**Kết Quả**:

-   SRS được cập nhật
-   Version mới được lưu
-   Thông báo cho collaborators (nếu có)

---

### UC013: Export SRS

**Mô Tả**: Người dùng xuất tài liệu SRS ra các định dạng khác nhau.

**Actor Chính**: Business Analyst

**Luồng Sự Kiện Chính**:

1. Từ SRS editor hoặc library, click "Export"
2. Chọn format:
    - PDF (formatted)
    - Word Document (.docx)
    - HTML
    - Markdown
    - JSON (structured data)
3. Chọn options:
    - Include/exclude sections
    - Styling template
    - Watermark settings
4. Click "Tạo Export"
5. Hệ thống generate file
6. Download file tự động

**Kết Quả**:

-   File được tạo theo format yêu cầu
-   Có thể chia sẻ với stakeholders

---

## 🎨 NHÓM USE CASE 5: WIREFRAME GENERATOR

### UC014: Tạo Wireframe Mới

**Mô Tả**: Người dùng tạo wireframe cho ứng dụng với công cụ drag-and-drop và AI assistance.

**Actor Chính**: UI/UX Designer, Product Manager

**Điều Kiện Tiên Quyết**:

-   Đã đăng nhập vào hệ thống

**Luồng Sự Kiện Chính**:

1. Truy cập `/dashboard/wireframegenerator`
2. Chọn template hoặc "Bắt đầu từ đầu"
3. Chọn device type (Mobile, Tablet, Desktop)
4. Mở wireframe editor với:

    **Toolbox Panel:**

    - Basic shapes (Rectangle, Circle, Line)
    - UI components (Button, Input, Image, Text)
    - Layout components (Header, Footer, Sidebar)
    - Navigation elements
    - Form elements

    **Canvas Area:**

    - Grid-based layout
    - Zoom controls
    - Multiple artboards

    **Properties Panel:**

    - Component properties
    - Styling options
    - Alignment tools

5. Người dùng drag-and-drop components lên canvas
6. Customize properties của components
7. Tạo connections giữa các screens (cho prototyping)
8. AI suggestion cho layout improvements
9. Save project với tên

**Tính Năng AI**:

-   Auto-align components
-   Suggest optimal layouts
-   Generate screens từ text description
-   Responsive design suggestions

**Kết Quả**:

-   Wireframe project được tạo
-   Có thể preview interactive prototype
-   Project được lưu vào library

---

### UC015: Collaborative Wireframe Editing

**Mô Tả**: Multiple users cùng edit wireframe real-time.

**Actor Chính**: Design Team Members

**Luồng Sự Kiện Chính**:

1. Owner share wireframe project với team
2. Team members nhận notification
3. Click vào shared project
4. Mở collaborative editor:
    - Live cursors của other users
    - Real-time changes sync
    - Comment system
    - Version control
5. Users có thể:
    - Edit simultaneously
    - Add comments/feedback
    - Suggest changes
    - View edit history

**Kết Quả**:

-   Team collaboration hiệu quả
-   Feedback được track
-   Design consistency

---

## 🤖 NHÓM USE CASE 6: AI CONVERSATION INTERFACE

### UC016: Bắt Đầu Chat với AI

**Mô Tả**: Người dùng tương tác với AI assistant để được hỗ trợ trong công việc phân tích.

**Actor Chính**: Tất cả người dùng đã đăng nhập

**Điều Kiện Tiên Quyết**:

-   Đã đăng nhập vào hệ thống
-   AI service hoạt động bình thường

**Luồng Sự Kiện Chính**:

1. Truy cập `/dashboard/aiconversations`
2. Hiển thị chat interface với:

    - Conversation list (sidebar)
    - Active chat area
    - Message input với rich text
    - File upload capability
    - Conversation settings

3. Bắt đầu new conversation:

    - Click "New Chat"
    - Chọn AI model (nếu có options)
    - Set conversation context/mode:
        - General BA Assistant
        - SRS Helper
        - Wireframe Consultant
        - Project Planning

4. Người dùng gửi tin nhắn
5. AI processing với loading indicator
6. AI response với:

    - Formatted text
    - Code blocks (nếu có)
    - Suggestions/action items
    - Follow-up questions

7. Conversation được auto-save

**Tính Năng Real-time**:

-   Typing indicators
-   Message delivery status
-   Live AI thinking process
-   Instant message sync

**Kết Quả**:

-   Conversation mới được tạo
-   AI sẵn sàng hỗ trợ
-   Context được maintained

---

### UC017: Quản Lý Conversations

**Mô Tả**: Người dùng quản lý các cuộc hội thoại với AI.

**Actor Chính**: Người dùng đã có conversations

**Luồng Sự Kiện Chính**:

1. Từ conversations list, người dùng có thể:

    **Organize Conversations:**

    - Rename conversation
    - Add tags/labels
    - Star important chats
    - Archive old conversations

    **Search & Filter:**

    - Search trong message content
    - Filter theo date range
    - Filter theo conversation type
    - Sort theo recent/alphabetical

    **Batch Operations:**

    - Select multiple conversations
    - Bulk delete/archive
    - Export conversations
    - Share với team members

2. Context menu cho mỗi conversation:
    - Rename
    - Duplicate
    - Export
    - Delete
    - Share

**Kết Quả**:

-   Conversations được organized hiệu quả
-   Easy access đến previous chats
-   Knowledge được preserved

---

### UC018: Export/Share AI Conversations

**Mô Tả**: Người dùng chia sẻ hoặc export conversations với stakeholders.

**Actor Chính**: Business Analyst, Project Manager

**Luồng Sự Kiện Chính**:

1. Từ active conversation, click "Share/Export"
2. Chọn sharing method:

    **Internal Sharing:**

    - Share với team members
    - Set permissions (view/edit)
    - Add expiration date

    **Export Options:**

    - PDF report
    - Word document
    - Markdown file
    - HTML page
    - JSON data

3. Customize export:

    - Include/exclude messages
    - Add cover page
    - Include metadata
    - Format styling

4. Generate và download/share

**Kết Quả**:

-   Conversation insights được chia sẻ
-   Stakeholders có access đến AI recommendations
-   Knowledge transfer hiệu quả

---

## 📱 NHÓM USE CASE 7: RESPONSIVE & NAVIGATION

### UC019: Navigation trên Mobile Device

**Mô Tả**: Người dùng sử dụng hệ thống trên thiết bị di động với experience tối ưu.

**Actor Chính**: Mobile Users

**Điều Kiện Tiên Quyết**:

-   Truy cập từ mobile browser
-   Screen width < 768px

**Luồng Sự Kiện Chính**:

1. Truy cập bất kỳ trang nào trong hệ thống
2. Hệ thống detect mobile viewport
3. Layout tự động adapt:

    **Header Adaptation:**

    - Logo thu gọn
    - Hamburger menu thay vì full navigation
    - Search icon thay vì search bar
    - User avatar menu compact

    **Sidebar Behavior:**

    - Hidden by default
    - Overlay style khi mở
    - Swipe gesture support
    - Touch-friendly menu items

    **Content Area:**

    - Single column layout
    - Increased touch targets
    - Swipe navigation
    - Optimized form controls

4. User interactions:
    - Tap hamburger → Sidebar slides in
    - Tap outside → Sidebar closes
    - Swipe gestures for navigation
    - Pull-to-refresh support

**Responsive Features**:

-   Touch-optimized buttons (44px min)
-   Readable font sizes (16px+)
-   Optimized image loading
-   Gesture support

**Kết Quả**:

-   Optimal mobile experience
-   Easy navigation với touch
-   Fast loading performance

---

### UC020: Dark Mode Toggle

**Mô Tả**: Người dùng chuyển đổi giữa light và dark mode.

**Actor Chính**: Tất cả người dùng

**Luồng Sự Kiện Chính**:

1. Từ bất kỳ trang nào, click dark mode toggle ở header
2. Hệ thống:
    - Toggle CSS classes (dark/light)
    - Update localStorage preference
    - Animate transition smoothly
    - Update all components theme
3. Theme được persist across sessions
4. Respect system preference nếu chưa set manual

**Kết Quả**:

-   Theme changed immediately
-   Preference được lưu
-   Consistent experience

---

## 🔒 NHÓM USE CASE 8: BẢO MẬT VÀ PHÂN QUYỀN

### UC021: Route Protection

**Mô Tả**: Hệ thống tự động bảo vệ các routes yêu cầu authentication.

**Actor**: Next.js Middleware

**Luồng Sự Kiện Chính**:

1. User truy cập protected route (VD: `/dashboard/*`)
2. Middleware kiểm tra access_token trong cookies
3. Nếu có token hợp lệ → Allow access
4. Nếu không có token → Redirect đến `/login`
5. Sau successful login → Redirect về intended route

**Kết Quả**:

-   Protected content được bảo vệ
-   Seamless authentication flow

---

### UC022: Session Management

**Mô Tả**: Hệ thống quản lý user sessions và token lifecycle.

**Actor**: Authentication System

**Luồng Sự Kiện Chính**:

1. User login → Tạo access token với expiry
2. Token được lưu trong HTTP-only cookies
3. Mỗi API request → Validate token
4. Token gần hết hạn → Auto refresh (nếu có refresh token)
5. Logout → Invalidate token và clear cookies
6. Expired token → Auto redirect đến login

**Kết Quả**:

-   Secure session management
-   Automatic token handling
-   Improved security posture

---

## 📊 NHÓM USE CASE 9: ANALYTICS VÀ MONITORING

### UC023: User Activity Tracking

**Mô Tả**: Hệ thống theo dõi hoạt động người dùng để analytics và cải thiện UX.

**Actor**: Analytics System

**Luồng Sự Kiện Chính**:

1. User thực hiện actions (page views, clicks, submissions)
2. Frontend gửi analytics events
3. Backend log activities
4. Dashboard hiển thị:
    - Usage statistics
    - Feature adoption
    - User journey analysis
    - Performance metrics

**Privacy Considerations**:

-   Anonymized data collection
-   GDPR compliance
-   User consent management
-   Data retention policies

**Kết Quả**:

-   Insights into user behavior
-   Data-driven product decisions
-   Performance monitoring

---

## 🚀 NHÓM USE CASE 10: PERFORMANCE VÀ OPTIMIZATION

### UC024: Progressive Web App Features

**Mô Tả**: Hệ thống cung cấp PWA experience với offline capabilities.

**Actor Chính**: Tất cả người dùng

**Luồng Sự Kiện Chính**:

1. User truy cập lần đầu → Service worker được install
2. Critical resources được cache
3. Subsequent visits → Load từ cache (faster)
4. Offline detection → Show offline indicator
5. Background sync → Queue actions khi offline
6. Network restored → Sync pending actions

**PWA Features**:

-   App installation prompt
-   Offline functionality
-   Background sync
-   Push notifications
-   Native app-like experience

**Kết Quả**:

-   Faster loading times
-   Offline functionality
-   Native app experience

---

## 📋 TỔNG KẾT VÀ METRICS

### Phân Loại Use Cases Theo Ưu Tiên

**🔴 Critical (MVP Core)**:

-   UC001-005: Authentication Flow
-   UC009: Dashboard Overview
-   UC011-013: SRS Generator
-   UC014: Wireframe Generator
-   UC016: AI Chat Interface
-   UC006-008: Profile Management

**🟡 Important (MVP Enhanced)**:

-   UC010: Global Search
-   UC015: Collaborative Editing
-   UC017-018: AI Conversation Management
-   UC019-020: Responsive Features

**🟢 Nice-to-have (Post-MVP)**:

-   UC021-024: Advanced Security & Performance
-   Analytics & Monitoring features
-   Advanced collaboration features

### Success Metrics

**User Engagement**:

-   Daily/Monthly Active Users
-   Session duration
-   Feature adoption rates
-   User retention rates

**Performance Metrics**:

-   Page load times < 3s
-   Time to interactive < 5s
-   Mobile performance scores > 90
-   Error rates < 1%

**Business Metrics**:

-   User registration conversion rate
-   Feature usage statistics
-   User satisfaction scores
-   Support ticket reduction

---

## 🔄 REVISION HISTORY

| Version | Date     | Author          | Changes                                      |
| ------- | -------- | --------------- | -------------------------------------------- |
| 1.0.0   | Oct 2025 | BA Copilot Team | Initial comprehensive use case specification |

---

**Ghi Chú**: Tài liệu này sẽ được cập nhật liên tục theo tiến độ phát triển dự án và feedback từ stakeholders. Mỗi use case sẽ được detail hơn trong các sprint tương ứng với implementation timeline trong project plan.
