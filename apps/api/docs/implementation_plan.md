# 1. Giải quyết lỗi khởi động Server (panic: connect database)

**Mô tả lỗi:** 
Lỗi `dial tcp 127.0.0.1:1521: connectex: No connection could be made because the target machine actively refused it.` xuất hiện do Server đang không thể đọc được file `.env`. Do đó, nó sử dụng các giá trị cấu hình mặc định (ví dụ port 1521 thay vì 5432, user trống...).

**Nguyên nhân:**
Bạn đang chạy lệnh `go run main.go` hoặc `go run cmd/server/main.go` **ở sai thư mục**. Hàm `godotenv.Load(".env")` sẽ tìm kiếm file `.env` ở thư mục hiện tại của terminal.

**Cách khắc phục:**
Bạn cần đảm bảo terminal đang đứng ở thư mục gốc của API (nơi chứa file `.env`) và chạy lệnh sau:
```bash
cd d:\Code\OWNER\eEnglish\apps\api
go run cmd/server/main.go
```

---

# 2. Kế hoạch Tối ưu Kích thước Ảnh Upload lên Minio

## User Review Required
> [!IMPORTANT]
> **Về việc chuyển đổi sang định dạng WebP trên Windows:**
> WebP là định dạng nén rất tốt, tuy nhiên hầu hết các thư viện Golang hỗ trợ xuất file WebP (như `github.com/kolesa-team/go-webp` hay `bimg`) đều yêu cầu phải có `CGO` (cần cài đặt trình biên dịch `gcc` của C/C++). Tôi vừa kiểm tra máy tính Windows của bạn và hiện tại **chưa có cài đặt gcc**, do đó nếu cố gắng cài các thư viện này, dự án Go sẽ báo lỗi không thể compile (biên dịch) được.

Để giải quyết, tôi đề xuất **2 Phương án** để bạn cân nhắc:

**Phương án 1 (Đề xuất - Nhanh gọn và Không cần cài đặt thêm C/C++):**
Sử dụng luôn thư viện `github.com/disintegration/imaging` đã có sẵn trong dự án của bạn (trong `processor.go`).
- Khi user upload ảnh, ta sẽ chặn luồng xử lý trước khi đẩy lên Minio.
- **Resize:** Thu nhỏ các ảnh có kích thước quá lớn (VD: Giới hạn chiều rộng tối đa là `1920px`, giữ nguyên tỷ lệ).
- **Compress:** Nén ảnh với chất lượng khoảng `80-85%` và lưu dưới dạng `JPEG` (đối với ảnh chụp) hoặc `PNG` (đối với ảnh có nền trong suốt).
- *Kết quả:* Một bức ảnh 5MB chụp từ điện thoại sẽ được giảm xuống chỉ còn khoảng ~200-500KB. Tốc độ load web vẫn cải thiện rất đáng kể mà không cần phải dùng WebP.

**Phương án 2 (Bắt buộc dùng WebP):**
- Sử dụng thư viện `github.com/nickalie/go-webpbin`. Thư viện này không cần `CGO`, mà nó sẽ tự động tải file thực thi `cwebp.exe` của Google về máy tính và gọi lệnh ngầm để convert ảnh sang WebP. 
- *Nhược điểm:* Tốn thêm resource CPU để chạy process bên ngoài, và đôi khi gặp rủi ro bị chặn bởi Antivirus/Firewall trên môi trường Windows Server do cơ chế tự động tải và chạy `.exe`.

## Proposed Changes (Dựa trên Phương án 1)

### `internal/infrastructure/filestorage/minio.go`
Sẽ sửa đổi logic upload để chặn luồng đối với các file ảnh.
- Khởi tạo `image.Processor` (đã có sẵn trong `internal/infrastructure/image/processor.go`).
- Trong hàm `UploadFile` và `UploadTypedAsset`: Kiểm tra nếu `mimeType` là ảnh (ví dụ `image/jpeg`, `image/png`), ta sẽ đọc file vào bộ nhớ.
- Gọi hàm `OptimizeImage` (đã có sẵn trong project) để tự động thay đổi kích thước nếu ảnh quá to và nén lại thành luồng byte JPEG.
- Thay đổi `contentType` và định dạng đuôi file sang `.jpg` nếu cần, sau đó mới upload luồng byte đã tối ưu đó lên Minio.
- Đảm bảo giữ nguyên các logic metadata khác.

## Open Questions
> [!IMPORTANT]
> **Vui lòng cho tôi biết bạn muốn chọn Phương án 1 (Tối ưu bằng JPEG/PNG bằng code có sẵn) hay Phương án 2 (Bắt buộc phải WebP thông qua tool bên ngoài)?** Nếu chọn phương án 1, tôi sẽ bắt tay vào implement ngay lập tức. Cứ comment lựa chọn của bạn vào chat nhé!
