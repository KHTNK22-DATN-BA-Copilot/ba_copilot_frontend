1. Khu vực Hiển thị Danh sách Key Hiện tại (Phía trên nút Save Changes):
Thêm một phần mới với tiêu đề "Your Configured API Keys" (API Keys Đã Cấu Hình Của Bạn). Đây là nơi hiển thị tất cả các key mà người dùng đã lưu, giúp họ quản lý dễ dàng:

Hiển thị Provider và Model: Ví dụ: "OpenAI - GPT-4o" với logo tương ứng.

Mã hóa Key: Key được hiển thị dưới dạng che khuất (sk-proj-••••••••••a1b2) để bảo mật, chỉ chừa lại vài ký tự đầu và cuối để người dùng nhận diện.

Trạng thái (Status): Sử dụng các badge màu sắc để hiển thị trạng thái của key (ví dụ: Green cho "Active", Yellow cho "Needs Re-validation" - Cần kiểm tra lại, hoặc Red cho "Invalid" - Không hợp lệ).

Hành động (Actions): Các biểu tượng thùng rác để "Delete" (Xóa) và nút text "Change Model" (Thay đổi model) cho mỗi key.

2. Khu vực Thêm hoặc Cập nhật API Key (Biểu mẫu Biểu cảm - Popup):
Để làm cho quá trình thêm mới hoặc thay đổi key diễn ra trực quan và thuận tiện, tôi đề xuất sử dụng một biểu mẫu kiểu Popup hoặc Modal khi người dùng nhấp vào biểu tượng "Change Model" hoặc một nút "Add New Key" tiềm năng.

Trong biểu mẫu này, tôi đã thiết kế các thành phần quan trọng:

Dropdown Provider: Người dùng có thể chọn các nhà cung cấp phổ biến (OpenAI, Anthropic, Google Gemini) kèm logo để dễ nhận biết.

Dropdown Model: Danh sách thả xuống này sẽ thay đổi dựa trên Provider được chọn. Ví dụ: Nếu chọn OpenAI, danh sách sẽ hiện GPT-4o, GPT-3.5-turbo, v.v.

Ô Nhập Key với Bảo mật: Một trường nhập liệu với type="password", hiển thị key dưới dạng dấu chấm để bảo mật. Có một biểu tượng "con mắt" 👁️ bên cạnh để người dùng có thể nhấp vào và kiểm tra lại key trước khi lưu.

Link Trợ giúp: Một dòng văn bản "Need to get an API key?" với link dẫn trực tiếp đến trang lấy key của nhà cung cấp, giúp người dùng dễ dàng hơn trong quá trình thiết lập.

Nút "Test Connection" (Kiểm tra Kết nối): Đây là một tính năng cực kỳ quan trọng cho UX. Nút này cho phép backend kiểm tra tính hợp lệ của key ngay lập tức. Nếu key không đúng, backend sẽ phản hồi lỗi ngay trên giao diện mà không cần lưu, giúp người dùng biết ngay và sửa lỗi.

Nút "Save Key" (Lưu Key): Chỉ được kích hoạt sau khi key được kiểm tra hợp lệ hoặc để commit key cuối cùng vào database.