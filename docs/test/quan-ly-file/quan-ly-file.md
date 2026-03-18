# Báo Cáo Kiểm Thử - Chức Năng Quản Lý File & Thư Mục

**Ngày cập nhật**: 12/03/2026  
**Module**: File & Folder Management - Quản lý file và thư mục  
**Phiên bản**: 2.0  
**Tổng số test case**: 20

---

## Mục lục

1. [TC-FM-001: Tạo thư mục gốc](#tc-fm-001)
2. [TC-FM-002: Tạo thư mục con (nested)](#tc-fm-002)
3. [TC-FM-003: Tạo thư mục trùng tên trong cùng cha](#tc-fm-003)
4. [TC-FM-004: Đổi tên thư mục](#tc-fm-004)
5. [TC-FM-005: Xóa thư mục rỗng](#tc-fm-005)
6. [TC-FM-006: Xóa thư mục chứa file](#tc-fm-006)
7. [TC-FM-007: Upload file hợp lệ](#tc-fm-007)
8. [TC-FM-008: Upload file PDF](#tc-fm-008)
9. [TC-FM-009: Upload file vượt quá 10MB](#tc-fm-009)
10. [TC-FM-010: Upload file có định dạng không được hỗ trợ](#tc-fm-010)
11. [TC-FM-011: Kéo thả file để upload](#tc-fm-011)
12. [TC-FM-012: Tải xuống file (Export)](#tc-fm-012)
13. [TC-FM-013: Xóa file](#tc-fm-013)
14. [TC-FM-014: Hiển thị cây thư mục đầy đủ](#tc-fm-014)
15. [TC-FM-015: Mở rộng và thu gọn thư mục](#tc-fm-015)
16. [TC-FM-016: Hiển thị thư mục trống](#tc-fm-016)
17. [TC-FM-017: Đổi tên thư mục hệ thống](#tc-fm-017)
18. [TC-FM-018: Tải file của người dùng khác](#tc-fm-018)
19. [TC-FM-019: Hiển thị thông tin file đúng](#tc-fm-019)
20. [TC-FM-020: Di chuyển thư mục gây vòng lặp](#tc-fm-020)

---

### TC-FM-001: Tạo thư mục gốc {#tc-fm-001}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo thư mục mới ở cấp gốc (root level) |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Đang ở trang file management của dự án (`/dashboard/project/{id}/files`) |
| **Các bước thực hiện** | 1. Nhấn nút "Create folder" ở cấp root<br>2. Nhập tên thư mục "Documents" vào ô inline<br>3. Nhấn Enter để xác nhận |
| **Dữ liệu test** | API: `POST /api/v1/projects/{project_id}/folders`<br>Body: `{ name: "Documents", parent_id: null }` |
| **Kết quả mong đợi** | - Thư mục "Documents" được tạo thành công<br>- Hiển thị trong cây thư mục ở cấp root<br>- parent_id = null |

---

### TC-FM-002: Tạo thư mục con (nested) {#tc-fm-002}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo thư mục con bên trong thư mục đã có |
| **Điều kiện tiên quyết** | - Thư mục "Documents" đã tồn tại (ID = 1) |
| **Các bước thực hiện** | 1. Hover lên thư mục "Documents"<br>2. Nhấn icon FolderPlus trên toolbar<br>3. Nhập tên "Reports"<br>4. Nhấn Enter |
| **Dữ liệu test** | API: `POST /api/v1/projects/{project_id}/folders`<br>Body: `{ name: "Reports", parent_id: 1 }` |
| **Kết quả mong đợi** | - Thư mục "Reports" tạo thành công với parent_id = 1<br>- Hiển thị lồng bên trong "Documents"<br>- Thư mục cha tự động mở rộng |

---

### TC-FM-003: Tạo thư mục trùng tên trong cùng cha {#tc-fm-003}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tạo thư mục có tên trùng với thư mục khác trong cùng cấp |
| **Điều kiện tiên quyết** | - Thư mục "Documents" đã tồn tại ở root |
| **Các bước thực hiện** | 1. Nhấn nút "Create folder" ở root<br>2. Nhập tên "Documents"<br>3. Nhấn Enter |
| **Dữ liệu test** | name: `"Documents"`, parent_id: `null` (trùng tên) |
| **Kết quả mong đợi** | - API trả về lỗi 400: "Folder name Documents already exists"<br>- Thư mục không được tạo<br>- Hiển thị thông báo lỗi cho người dùng |

---

### TC-FM-004: Đổi tên thư mục {#tc-fm-004}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Đổi tên thư mục thông qua inline edit |
| **Điều kiện tiên quyết** | - Thư mục "Documents" tồn tại (ID = 1)<br>- Không phải thư mục hệ thống |
| **Các bước thực hiện** | 1. Hover lên thư mục "Documents"<br>2. Nhấn icon Edit2 (bút chỉnh sửa)<br>3. Ô input inline hiển thị với tên hiện tại<br>4. Sửa thành "Project Documents"<br>5. Nhấn Enter hoặc click ra ngoài (blur) |
| **Dữ liệu test** | API: `PATCH /api/v1/folders/1`<br>Body: `{ name: "Project Documents" }` |
| **Kết quả mong đợi** | - Tên thư mục cập nhật thành "Project Documents"<br>- Cây thư mục cập nhật ngay (optimistic UI)<br>- Nhấn Escape sẽ hủy thao tác |

---

### TC-FM-005: Xóa thư mục rỗng {#tc-fm-005}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xóa thư mục không chứa file hoặc thư mục con |
| **Điều kiện tiên quyết** | - Thư mục "Empty Folder" tồn tại (ID = 5)<br>- Thư mục không chứa nội dung<br>- Không phải thư mục hệ thống |
| **Các bước thực hiện** | 1. Hover lên thư mục "Empty Folder"<br>2. Nhấn icon FolderMinus (xóa)<br>3. Xác nhận xóa |
| **Dữ liệu test** | API: `DELETE /api/v1/folders/5` |
| **Kết quả mong đợi** | - Thư mục soft delete (is_deleted = true)<br>- Thư mục biến mất khỏi cây thư mục<br>- Cả cây file tree cập nhật |

---

### TC-FM-006: Xóa thư mục chứa file {#tc-fm-006}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xóa thư mục có chứa file và thư mục con |
| **Điều kiện tiên quyết** | - Thư mục "Documents" chứa 2 file và 1 thư mục con |
| **Các bước thực hiện** | 1. Hover lên thư mục "Documents"<br>2. Nhấn icon xóa<br>3. Hộp thoại xác nhận xuất hiện với cảnh báo |
| **Dữ liệu test** | Cảnh báo: "Folder is not empty. Deleting will remove all nested files and folders. Confirm delete?" |
| **Kết quả mong đợi** | - Hiển thị hộp thoại xác nhận với cảnh báo nội dung sẽ bị xóa<br>- Nhấn Confirm: xóa thư mục và tất cả nội dung bên trong<br>- Nhấn Cancel: hủy thao tác, thư mục vẫn nguyên |

---

### TC-FM-007: Upload file hợp lệ {#tc-fm-007}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Upload file .txt hợp lệ vào thư mục |
| **Điều kiện tiên quyết** | - Thư mục "Documents" tồn tại (folder_id = 1)<br>- File test: `requirements.txt` (500KB) |
| **Các bước thực hiện** | 1. Hover lên thư mục "Documents"<br>2. Nhấn icon FilePlus (upload)<br>3. Chọn file `requirements.txt` từ máy<br>4. Chờ upload hoàn tất |
| **Dữ liệu test** | API: `POST /api/v1/files/upload/{project_id}/1`<br>Form data: file `requirements.txt`, path = "Documents"<br>Định dạng hợp lệ: .txt, kích thước < 10MB |
| **Kết quả mong đợi** | - Hiển thị loading spinner trong quá trình upload<br>- File hiển thị trong thư mục "Documents" sau khi hoàn tất<br>- Hiển thị icon check xanh khi thành công<br>- Server chuyển đổi file sang Markdown<br>- AI service trích xuất metadata tự động |

---

### TC-FM-008: Upload file PDF {#tc-fm-008}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Upload file PDF vào dự án |
| **Điều kiện tiên quyết** | - File test: `project_spec.pdf` (2MB) |
| **Các bước thực hiện** | 1. Nhấn upload vào thư mục<br>2. Chọn file `project_spec.pdf`<br>3. Chờ upload hoàn tất |
| **Dữ liệu test** | File: `project_spec.pdf`, extension: `.pdf`, size: 2MB |
| **Kết quả mong đợi** | - Upload thành công (PDF là định dạng được hỗ trợ)<br>- Server lưu file gốc (.pdf) và phiên bản Markdown (.md) vào Supabase<br>- Metadata được trích xuất từ nội dung PDF |

---

### TC-FM-009: Upload file vượt quá 10MB {#tc-fm-009}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Upload file có kích thước vượt quá giới hạn 10MB |
| **Điều kiện tiên quyết** | - File test: `large_video.doc` (15MB) |
| **Các bước thực hiện** | 1. Mở khu vực upload<br>2. Chọn hoặc kéo thả file 15MB<br>3. Quan sát phản hồi |
| **Dữ liệu test** | File size: 15MB, max allowed: 10MB |
| **Kết quả mong đợi** | - Frontend tự động lọc file vượt quá 10MB<br>- Không gửi request upload lên server<br>- Hiển thị thông báo lỗi kích thước |

---

### TC-FM-010: Upload file có định dạng không được hỗ trợ {#tc-fm-010}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Upload file có đuôi không nằm trong danh sách cho phép |
| **Điều kiện tiên quyết** | - File test: `image.png` (1MB) |
| **Các bước thực hiện** | 1. Mở khu vực upload<br>2. Chọn file `image.png`<br>3. Quan sát phản hồi |
| **Dữ liệu test** | File: `image.png`, extension: `.png`<br>Allowed: `.pdf, .doc, .docx, .txt, .md` |
| **Kết quả mong đợi** | - Frontend từ chối file do định dạng không hợp lệ<br>- Hiển thị thông báo: chỉ hỗ trợ .pdf, .doc, .docx, .txt, .md<br>- Không gửi request upload |

---

### TC-FM-011: Kéo thả file để upload {#tc-fm-011}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Upload file bằng cách kéo thả (Drag & Drop) |
| **Điều kiện tiên quyết** | - Khu vực upload FileUpload đang hiển thị<br>- File test: `notes.md` (100KB) |
| **Các bước thực hiện** | 1. Kéo file `notes.md` từ desktop<br>2. Di chuột vào vùng drop zone<br>3. Quan sát viền xanh (isDragOver)<br>4. Thả file vào vùng drop |
| **Dữ liệu test** | File: `notes.md`, kéo thả vào drop zone |
| **Kết quả mong đợi** | - Khi kéo file vào vùng: viền chuyển sang xanh (visual feedback)<br>- Khi thả: file được validate (định dạng, kích thước)<br>- File hợp lệ → bắt đầu upload tự động<br>- Hiển thị trạng thái upload (spinner → checkmark) |

---

### TC-FM-012: Tải xuống file (Export) {#tc-fm-012}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Tải xuống file đã upload từ cây thư mục |
| **Điều kiện tiên quyết** | - File "requirements.txt" đã upload (document_id = "abc-123")<br>- Người dùng là chủ sở hữu file |
| **Các bước thực hiện** | 1. Tìm file "requirements.txt" trong cây thư mục<br>2. Nhấn nút download (icon tải xuống)<br>3. Chờ file tải về |
| **Dữ liệu test** | API: `GET /api/v1/files/export/abc-123`<br>Response: StreamingResponse (blob) |
| **Kết quả mong đợi** | - File được tải xuống dưới dạng blob<br>- Header `Content-Disposition: attachment; filename=requirements.txt`<br>- Nội dung file đúng, không bị hỏng |

---

### TC-FM-013: Xóa file {#tc-fm-013}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Xóa file khỏi thư mục |
| **Điều kiện tiên quyết** | - File "notes.md" tồn tại trong thư mục "Documents" |
| **Các bước thực hiện** | 1. Tìm file "notes.md" trong cây thư mục<br>2. Nhấn nút xóa (icon thùng rác đỏ)<br>3. Xác nhận xóa |
| **Dữ liệu test** | File ID cần xóa |
| **Kết quả mong đợi** | - File biến mất khỏi cây thư mục (optimistic UI)<br>- Số lượng file trong thư mục giảm 1<br>- File bị xóa trên server |

---

### TC-FM-014: Hiển thị cây thư mục đầy đủ {#tc-fm-014}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra hiển thị cấu trúc cây thư mục project tree |
| **Điều kiện tiên quyết** | - Dự án có cấu trúc:<br>  Documents/<br>    Reports/<br>      quarterly.pdf<br>    notes.txt<br>  Images/ |
| **Các bước thực hiện** | 1. Truy cập trang files management<br>2. Quan sát cây thư mục hiển thị |
| **Dữ liệu test** | API: `GET /api/v1/projects/{project_id}/tree`<br>Response: cấu trúc recursive FolderNode |
| **Kết quả mong đợi** | - Cây thư mục hiển thị đúng cấu trúc phân cấp<br>- Thư mục có icon folder, file có icon file<br>- Đếm file chính xác (badge "X files")<br>- Thư mục có chứa children tự động expand khi load |

---

### TC-FM-015: Mở rộng và thu gọn thư mục {#tc-fm-015}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Bấm toggle để mở rộng/thu gọn thư mục |
| **Điều kiện tiên quyết** | - Thư mục "Documents" chứa file con |
| **Các bước thực hiện** | 1. Nhấn vào toggle thư mục "Documents" (đang mở)<br>2. Quan sát thư mục thu gọn<br>3. Nhấn lại toggle<br>4. Quan sát thư mục mở rộng |
| **Dữ liệu test** | expandedFolders Set toggle |
| **Kết quả mong đợi** | - Click 1: thư mục thu gọn, ẩn file con<br>- Click 2: thư mục mở rộng, hiển thị file con<br>- Trạng thái toggle đúng (icon mũi tên xoay) |

---

### TC-FM-016: Hiển thị thư mục trống {#tc-fm-016}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Hiển thị trạng thái trống khi thư mục không có file |
| **Điều kiện tiên quyết** | - Thư mục "Empty Folder" tồn tại nhưng trống |
| **Các bước thực hiện** | 1. Mở rộng thư mục "Empty Folder"<br>2. Quan sát nội dung |
| **Dữ liệu test** | Thư mục không chứa file hay thư mục con |
| **Kết quả mong đợi** | - Hiển thị text: "No files in this folder"<br>- Có link "upload" để người dùng upload file<br>- Badge hiển thị "0 files" |

---

### TC-FM-017: Đổi tên thư mục hệ thống {#tc-fm-017}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra không thể đổi tên hoặc xóa thư mục hệ thống |
| **Điều kiện tiên quyết** | - Có thư mục hệ thống (systemFileType = true) |
| **Các bước thực hiện** | 1. Hover lên thư mục hệ thống<br>2. Kiểm tra toolbar hiển thị |
| **Dữ liệu test** | Thư mục có thuộc tính `systemFileType: true` |
| **Kết quả mong đợi** | - Nút Edit2 (đổi tên) bị ẩn<br>- Nút FolderMinus (xóa) bị ẩn<br>- Chỉ hiển thị nút upload file và tạo thư mục con |

---

### TC-FM-018: Tải file của người dùng khác {#tc-fm-018}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Cố tải xuống file thuộc sở hữu người dùng khác |
| **Điều kiện tiên quyết** | - Đăng nhập với User A<br>- File document_id = "xyz-789" thuộc User B |
| **Các bước thực hiện** | 1. Gọi trực tiếp API export với document_id của User B<br>2. Quan sát phản hồi |
| **Dữ liệu test** | API: `GET /api/v1/files/export/xyz-789`<br>File created_by != current_user.id |
| **Kết quả mong đợi** | - Backend kiểm tra `created_by != current_user.id`<br>- Trả về lỗi 403 Forbidden<br>- Không trả về nội dung file |

---

### TC-FM-019: Hiển thị thông tin file đúng {#tc-fm-019}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Kiểm tra thông tin file hiển thị chính xác (tên, kích thước, ngày) |
| **Điều kiện tiên quyết** | - File "project_spec.pdf" đã upload (2.5MB, ngày 15/01/2026) |
| **Các bước thực hiện** | 1. Tìm file "project_spec.pdf" trong cây thư mục<br>2. Kiểm tra tên hiển thị<br>3. Kiểm tra kích thước hiển thị<br>4. Kiểm tra ngày hiển thị |
| **Dữ liệu test** | File: name="project_spec.pdf", size=2621440 bytes, created_at="2026-01-15" |
| **Kết quả mong đợi** | - Tên: "project_spec.pdf" (truncated nếu quá dài)<br>- Kích thước: "2.50 MB" (format formatFileSize)<br>- Ngày: "15-01-2026" (format dd-MM-yyyy)<br>- Icon file tương ứng với loại file |

---

### TC-FM-020: Di chuyển thư mục gây vòng lặp {#tc-fm-020}

| Tiêu chí | Nội dung |
|----------|----------|
| **Tên test case** | Di chuyển thư mục cha vào thư mục con (circular reference) |
| **Điều kiện tiên quyết** | - Cấu trúc: A → B → C (A chứa B, B chứa C) |
| **Các bước thực hiện** | 1. Gọi API di chuyển thư mục A vào thư mục C<br>2. Quan sát phản hồi |
| **Dữ liệu test** | API: `PATCH /api/v1/folders/{A_id}`<br>Body: `{ parent_id: C_id }`<br>A là cha của B, B là cha của C |
| **Kết quả mong đợi** | - Backend phát hiện vòng lặp (recursive ancestry check)<br>- Trả về lỗi 400: "Cannot move folder, circular reference detected"<br>- Cấu trúc thư mục không thay đổi |
