# Tài Liệu Kiểm Thử - BA Copilot

**Ngày cập nhật**: 12/03/2026  
**Phiên bản**: 2.0  
**Tổng số test case**: 229  
**Số file kiểm thử**: 17

## Tổng quan

Bộ tài liệu kiểm thử toàn diện cho hệ thống BA Copilot, bao gồm Frontend (Next.js), Backend (FastAPI), và AI Service (LangGraph). Các test case được viết bằng tiếng Việt, tổ chức theo từng module chức năng.

---

## Danh sách file kiểm thử

### Phase 1: Xác thực & Tài khoản (84 TC)

| # | Module | File | Số TC |
|---|--------|------|-------|
| 1 | Đăng nhập | [dang-nhap/dang-nhap.md](dang-nhap/dang-nhap.md) | 15 |
| 2 | Đăng ký | [dang-ky/dang-ky.md](dang-ky/dang-ky.md) | 20 |
| 3 | Quên mật khẩu | [quen-mat-khau/quen-mat-khau.md](quen-mat-khau/quen-mat-khau.md) | 15 |
| 4 | Xác thực email | [xac-thuc-email/xac-thuc-email.md](xac-thuc-email/xac-thuc-email.md) | 8 |
| 5 | Đăng xuất | [dang-xuat/dang-xuat.md](dang-xuat/dang-xuat.md) | 6 |
| 6 | Đổi mật khẩu | [doi-mat-khau/doi-mat-khau.md](doi-mat-khau/doi-mat-khau.md) | 8 |
| 7 | Hồ sơ người dùng | [ho-so-nguoi-dung/ho-so-nguoi-dung.md](ho-so-nguoi-dung/ho-so-nguoi-dung.md) | 12 |

### Phase 2: Dashboard & Quản lý (48 TC)

| # | Module | File | Số TC |
|---|--------|------|-------|
| 8 | Bảng điều khiển | [bang-dieu-khien/bang-dieu-khien.md](bang-dieu-khien/bang-dieu-khien.md) | 10 |
| 9 | Quản lý dự án | [quan-ly-du-an/quan-ly-du-an.md](quan-ly-du-an/quan-ly-du-an.md) | 18 |
| 10 | Quản lý file | [quan-ly-file/quan-ly-file.md](quan-ly-file/quan-ly-file.md) | 20 |

### Phase 3: Tạo tài liệu (45 TC)

| # | Module | File | Số TC |
|---|--------|------|-------|
| 11 | Tạo SRS | [tao-srs/tao-srs.md](tao-srs/tao-srs.md) | 15 |
| 12 | Tạo Diagram | [tao-diagram/tao-diagram.md](tao-diagram/tao-diagram.md) | 18 |
| 13 | Tạo Wireframe | [tao-wireframe/tao-wireframe.md](tao-wireframe/tao-wireframe.md) | 12 |

### Phase 4: Quy trình & AI (42 TC)

| # | Module | File | Số TC |
|---|--------|------|-------|
| 14 | Quy trình làm việc | [quy-trinh-lam-viec/quy-trinh-lam-viec.md](quy-trinh-lam-viec/quy-trinh-lam-viec.md) | 20 |
| 15 | Trợ lý AI | [tro-ly-ai/tro-ly-ai.md](tro-ly-ai/tro-ly-ai.md) | 12 |
| 16 | Chatbot | [chatbot/chatbot.md](chatbot/chatbot.md) | 10 |

### Phase 5: Phi chức năng (10 TC)

| # | Module | File | Số TC |
|---|--------|------|-------|
| 17 | Phi chức năng | [phi-chuc-nang/phi-chuc-nang.md](phi-chuc-nang/phi-chuc-nang.md) | 10 |

---

## Thống kê tổng hợp

| Hạng mục | Số lượng |
|----------|----------|
| **Tổng test case** | **229** |
| Authentication & Account | 84 |
| Dashboard & Quản lý | 48 |
| Document Generation | 45 |
| Quy trình & AI | 42 |
| Phi chức năng | 10 |

---

## Định dạng test case

Mỗi test case bao gồm 5 trường:

| Trường | Mô tả |
|--------|-------|
| **Tên test case** | Mô tả ngắn gọn mục đích kiểm thử |
| **Điều kiện tiên quyết** | Các điều kiện cần có trước khi thực hiện |
| **Các bước thực hiện** | Hướng dẫn từng bước chi tiết |
| **Dữ liệu test** | Dữ liệu đầu vào cụ thể |
| **Kết quả mong đợi** | Kết quả kỳ vọng khi kiểm thử thành công |

**Quy ước mã test case**: `TC-{MODULE}-{NNN}`  
VD: `TC-LG-001` (Login), `TC-RG-001` (Register), `TC-NF-001` (Non-Functional)

---

## Hệ thống được kiểm thử

| Thành phần | Công nghệ | Đường dẫn |
|-----------|-----------|-----------|
| Frontend | Next.js, React, TypeScript | `Frontend/ba-copilot/` |
| Backend | FastAPI, SQLAlchemy, PostgreSQL | `ba_copilot_backend/` |
| AI Service | LangGraph, OpenRouter LLM | `ba_copilot_ai/` |
| Database | PostgreSQL (Supabase) | `schema_improved.sql` |

## Lịch sử cập nhật

| Phiên bản | Ngày | Thay đổi |
|-----------|------|----------|
| 1.0.0 | 11/2025 | Cấu trúc ban đầu |
| 1.1.0 | 12/2025 | Thêm file management, diagram, workflow, AI conversations, chatbot |
| 2.0.0 | 03/2026 | Viết lại toàn bộ - 17 file, 229 test case bằng tiếng Việt theo format chuẩn |