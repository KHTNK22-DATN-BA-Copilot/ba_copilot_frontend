## Kế hoạch test: Chức năng Dashboard

### Tổng quan

Tài liệu test này cover chức năng dashboard chính của ứng dụng BA Copilot, gồm có các thành phần:

-   Header với search và user actions
-   Sidebar navigation (desktop)
-   Overview section với các thẻ tổng quan
-   Projects section với danh sách và filter
-   Dark/Light mode toggle
-   Responsive design

### Test Cases

#### 1. Dashboard Load Successfully

| **Tiêu chí**        | **Nội dung**                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng đăng nhập thành công và truy cập dashboard.                                                 |
| Dữ liệu đầu vào mẫu | Token hợp lệ, user đã authenticated                                                                    |
| Các bước thực hiện  | 1. Đăng nhập thành công.<br>2. Điều hướng đến trang dashboard.<br>3. Kiểm tra các thành phần hiển thị. |
| Kết quả mong muốn   | Dashboard hiển thị đầy đủ: header, sidebar, overview cards, projects section, footer.                  |
| Kết quả thực tế     | Dashboard hiển thị đầy đủ các thành phần đã cài đặt sẵn trong page.                                                                                                       |

---

#### 2. Header Logo Navigation

| **Tiêu chí**        | **Nội dung**                                                    |
| ------------------- | --------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào logo "🤖 BA Copilot" trên header.          |
| Dữ liệu đầu vào mẫu | Đang ở trang dashboard                                          |
| Các bước thực hiện  | 1. Click vào logo BA Copilot.<br>2. Quan sát hành vi của trang. |
| Kết quả mong muốn   | Trang được reload để refresh dữ liệu dashboard.                 |
| Kết quả thực tế     |  Ở trang dashboard, click vào thì reload trang.                                                              |

---

#### 3. Header Logo Navigation from Other Pages

| **Tiêu chí**        | **Nội dung**                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng đang ở trang khác (AI Conversations, Settings, etc.) và click logo.                      |
| Dữ liệu đầu vào mẫu | Đang ở trang /aiconversations hoặc /accountsetting                                                  |
| Các bước thực hiện  | 1. Điều hướng đến trang khác dashboard.<br>2. Click vào logo BA Copilot.<br>3. Kiểm tra điều hướng. |
| Kết quả mong muốn   | Điều hướng về trang dashboard.                                                                      |
| Kết quả thực tế     | Ở các trang không phải dashboard click vào thì reload và navigate trở về trang dashboard.                                                                                                   |

---

#### 4. Search Functionality - Open Modal

| **Tiêu chí**        | **Nội dung**                                                                  |
| ------------------- | ----------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng muốn tìm kiếm projects, documents, users.                          |
| Dữ liệu đầu vào mẫu | Click vào search bar hoặc nhấn Ctrl+K/Cmd+K                                   |
| Các bước thực hiện  | 1. Click vào search bar.<br>2. Hoặc nhấn tổ hợp phím Ctrl+K (Cmd+K trên Mac). |
| Kết quả mong muốn   | Modal search mở ra với input focus, hiển thị placeholder text.                |
| Kết quả thực tế     |  Test trên macOs, command K mở được search bar. Click vào search bar bên trên header cho kết quả tương tự.                                                                             |

---

#### 5. Search Functionality - Keyboard Shortcut

| **Tiêu chí**        | **Nội dung**                                                        |
| ------------------- | ------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng sử dụng keyboard shortcut để mở search.                  |
| Dữ liệu đầu vào mẫu | Nhấn Ctrl+K (Windows/Linux) hoặc Cmd+K (Mac)                        |
| Các bước thực hiện  | 1. Nhấn tổ hợp phím Ctrl+K hoặc Cmd+K.<br>2. Kiểm tra modal search. |
| Kết quả mong muốn   | Modal search mở ra ngay lập tức với focus vào input field.          |
| Kết quả thực tế     |  Search bar được mở, background blur và tối hơn, có thể nhập ký tự để tìm kiếm.                                                                   |

---

#### 6. Dark Mode Toggle

| **Tiêu chí**        | **Nội dung**                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng muốn chuyển đổi giữa dark mode và light mode.                                              |
| Dữ liệu đầu vào mẫu | Ở chế độ light mode hoặc dark mode                                                                    |
| Các bước thực hiện  | 1. Click vào nút toggle dark/light mode (icon mặt trời/mặt trăng).<br>2. Kiểm tra thay đổi giao diện. |
| Kết quả mong muốn   | Giao diện chuyển đổi mượt mà, theme được lưu vào localStorage.                                        |
| Kết quả thực tế     |  Chuyển đổi được darkmode, lightmode, giữ trạng thái ngay cả khi reload page.                                                                                                  |

---

#### 7. User Avatar Dropdown

| **Tiêu chí**        | **Nội dung**                                                     |
| ------------------- | ---------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào avatar để mở menu dropdown.                 |
| Dữ liệu đầu vào mẫu | Avatar hiển thị (🦀 icon)                                        |
| Các bước thực hiện  | 1. Click vào avatar.<br>2. Kiểm tra dropdown menu hiển thị.      |
| Kết quả mong muốn   | Dropdown menu hiển thị với các option: Account Settings, Logout. |
| Kết quả thực tế     | Dropdown menu được mở với 2 lựa chọn: Account settings và Logout.                                                                 |

---

#### 8. Account Settings Navigation

| **Tiêu chí**        | **Nội dung**                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào "Account Settings" trong dropdown.                           |
| Dữ liệu đầu vào mẫu | Dropdown menu đang mở                                                             |
| Các bước thực hiện  | 1. Mở avatar dropdown.<br>2. Click "Account Settings".<br>3. Kiểm tra điều hướng. |
| Kết quả mong muốn   | Điều hướng đến trang /accountsetting, dropdown đóng lại.                          |
| Kết quả thực tế     |  Dẫn sang trang Account Settings ( trang chưa có layout).                                                                                 |

---

#### 9. Logout Functionality

| **Tiêu chí**        | **Nội dung**                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng muốn đăng xuất khỏi hệ thống.                                                      |
| Dữ liệu đầu vào mẫu | User đã đăng nhập, có token trong localStorage                                                |
| Các bước thực hiện  | 1. Mở avatar dropdown.<br>2. Click "Logout".<br>3. Kiểm tra quá trình logout.                 |
| Kết quả mong muốn   | API logout được call, localStorage cleared, điều hướng đến /login, theme reset về light mode. |
| Kết quả thực tế     | Đăng xuất thành công và được navigate sang trang Login, theme được xoá và trở lại lightmode.                                                                                              |

---

#### 10. Sidebar Navigation - Desktop

| **Tiêu chí**        | **Nội dung**                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng sử dụng desktop và muốn điều hướng qua sidebar.                                   |
| Dữ liệu đầu vào mẫu | Screen size ≥ 1024px (lg breakpoint)                                                         |
| Các bước thực hiện  | 1. Mở dashboard trên desktop.<br>2. Click các item trong sidebar.<br>3. Kiểm tra navigation. |
| Kết quả mong muốn   | Sidebar hiển thị, active page được highlight, navigation hoạt động đúng.                     |
| Kết quả thực tế     |  Có thể navigate sang các trang trên sidebar.                                                                                            |

---

#### 11. Mobile Responsive Layout

| **Tiêu chí**        | **Nội dung**                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng truy cập dashboard trên mobile device.                                              |
| Dữ liệu đầu vào mẫu | Screen size < 1024px                                                                           |
| Các bước thực hiện  | 1. Resize browser xuống mobile size.<br>2. Kiểm tra layout responsive.<br>3. Test mobile menu. |
| Kết quả mong muốn   | Sidebar ẩn, mobile search bar xuất hiện, layout stack vertically, mobile menu hoạt động.       |
| Kết quả thực tế     |    Sidebar bị ẩn khi ở chế độ mobile, chưa fix để hiển thị được Sidebar ở chế độ mobile.                                                                                            |

---

#### 12. Projects Section - Filter Dropdown

| **Tiêu chí**        | **Nội dung**                                                                    |
| ------------------- | ------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng muốn filter projects theo tiêu chí.                                  |
| Dữ liệu đầu vào mẫu | Projects section hiển thị với filter button                                     |
| Các bước thực hiện  | 1. Click vào filter dropdown.<br>2. Chọn option filter.<br>3. Kiểm tra kết quả. |
| Kết quả mong muốn   | Dropdown mở ra, hiển thị options (Most Recent, Title), selection hoạt động.     |
| Kết quả thực tế     |   Chưa có data đêt test, phần filter dropdownđã hoạt động nhưng chưa có api.                                                                              |

---

#### 13. Overview Cards Display

| **Tiêu chí**        | **Nội dung**                                                                          |
| ------------------- | ------------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng xem tổng quan thống kê trên dashboard.                                     |
| Dữ liệu đầu vào mẫu | Dashboard data loaded                                                                 |
| Các bước thực hiện  | 1. Load dashboard.<br>2. Kiểm tra overview section.<br>3. Verify responsive behavior. |
| Kết quả mong muốn   | 5 cards hiển thị responsive: 2 cols mobile, 3 cols tablet, 5 cols desktop.            |
| Kết quả thực tế     |     Chưa có dữ liệu thực tế, chỉ có hiển thị đúng section của overview.                                                                                  |

---

#### 14. Theme Persistence After Page Reload

| **Tiêu chí**        | **Nội dung**                                                                     |
| ------------------- | -------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng đã chọn dark mode và reload trang.                                    |
| Dữ liệu đầu vào mẫu | Dark mode đã được set, theme='dark' trong localStorage                           |
| Các bước thực hiện  | 1. Chuyển sang dark mode.<br>2. Reload trang.<br>3. Kiểm tra theme được giữ lại. |
| Kết quả mong muốn   | Dark mode được maintained sau khi reload, không bị flash light mode.             |
| Kết quả thực tế     |  Theme mode vẫn giữ sau khi người dùng reload page. Theme mode được lưu trong localStorage.                                                                                |

---

#### 15. Error Handling - Unauthorized Access

| **Tiêu chí**        | **Nội dung**                                                                        |
| ------------------- | ----------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng chưa đăng nhập hoặc token hết hạn truy cập dashboard.                    |
| Dữ liệu đầu vào mẫu | Không có token hoặc token không hợp lệ                                              |
| Các bước thực hiện  | 1. Clear localStorage.<br>2. Truy cập /dashboard.<br>3. Kiểm tra redirect behavior. |
| Kết quả mong muốn   | Redirect về trang login hoặc hiển thị error message appropriate.                    |
| Kết quả thực tế     |  Chưa xử lý trường hợp này                                                                                   |

---

#### 16. Click Outside Dropdown Close

| **Tiêu chí**        | **Nội dung**                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng mở dropdown và click ra ngoài để đóng.                                 |
| Dữ liệu đầu vào mẫu | Avatar dropdown hoặc filter dropdown đang mở                                      |
| Các bước thực hiện  | 1. Mở dropdown.<br>2. Click ra ngoài vùng dropdown.<br>3. Kiểm tra dropdown đóng. |
| Kết quả mong muốn   | Dropdown đóng lại khi click outside, UX smooth.                                   |
| Kết quả thực tế     | Dropdown đóng, UX mượt mà.                                                                                  |

---

#### 17. Search Modal Close Functionality

| **Tiêu chí**        | **Nội dung**                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng muốn đóng search modal.                                                |
| Dữ liệu đầu vào mẫu | Search modal đang mở                                                              |
| Các bước thực hiện  | 1. Mở search modal.<br>2. Nhấn ESC hoặc click outside.<br>3. Kiểm tra modal đóng. |
| Kết quả mong muốn   | Modal đóng lại, focus trở về element trước đó.                                    |
| Kết quả thực tế     |  Search model đóng sau khi nhấn ESC.                                                                                 |

---

#### 18. Projects Grid Responsive Layout

| **Tiêu chí**        | **Nội dung**                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Ngữ cảnh thực hiện  | Người dùng xem projects trên các kích thước màn hình khác nhau.                                  |
| Dữ liệu đầu vào mẫu | Projects data hiển thị trong grid layout                                                         |
| Các bước thực hiện  | 1. Test trên mobile (2 cols).<br>2. Test trên tablet (3 cols).<br>3. Test trên desktop (5 cols). |
| Kết quả mong muốn   | Grid responsive đúng theo breakpoints, spacing consistent.                                       |
| Kết quả thực tế     |  Mobile (test trên iPhone SE, iPhone 14 Promax) hiển thị 2 cột ở phần project. Với màn hình iPad hiển thị 5 cột, màn hình desktop hiển thị 5 cột. Khi kéo thả cửa sổ trên desktop, UI thu phóng 2, 3, 5 cột tuỳ vào kích thước chiều rộng của của sột một cách mượt mà.                                                                                                |

---

#### 19. Add Button Functionality

| **Tiêu chí**        | **Nội dung**                                               |
| ------------------- | ---------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào nút "+" trong header để thêm mới.     |
| Dữ liệu đầu vào mẫu | Add button (+ icon) trong user actions                     |
| Các bước thực hiện  | 1. Click vào nút "+"..<br>2. Kiểm tra action được trigger. |
| Kết quả mong muốn   | Action thêm mới được thực hiện (tùy business logic).       |
| Kết quả thực tế     |    Chưa handle Add button, không click được.                                                        |

---

#### 20. Footer Links Navigation

| **Tiêu chí**        | **Nội dung**                                                                  |
| ------------------- | ----------------------------------------------------------------------------- |
| Ngữ cảnh thực hiện  | Người dùng click vào các links trong footer.                                  |
| Dữ liệu đầu vào mẫu | Footer hiển thị với các links: Features, About, Privacy, etc.                 |
| Các bước thực hiện  | 1. Scroll xuống footer.<br>2. Click vào các links.<br>3. Kiểm tra navigation. |
| Kết quả mong muốn   | Links hoạt động đúng, navigate đến trang tương ứng hoặc mở external links.    |
| Kết quả thực tế     | Footer chỉ mock data và không gắn kèm link.                                                                              |
