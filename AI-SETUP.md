# Cấu hình AI tạo câu hỏi từ thư viện

Trang GitHub Pages chỉ lưu tài liệu và bộ câu hỏi trên trình duyệt. Khi bấm **Tạo câu hỏi bằng Gemini**, tài liệu đã chọn được gửi tới Cloudflare Worker và Google Gemini để xử lý. API key chỉ nằm trong Worker Secret; không đưa API key vào HTML hoặc gửi qua chat.

## Triển khai Cloudflare Worker

1. Tạo Gemini API key trong Google AI Studio và tài khoản Cloudflare Workers.
2. Tại thư mục dự án, chạy `npm ci` rồi `npx wrangler login`.
3. Tạo secret Gemini:

   ```powershell
   npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.jsonc
   ```

4. Tạo một access token ngẫu nhiên riêng (khuyến nghị ít nhất 32 ký tự; có thể dùng password manager), không dùng Gemini API key làm token, rồi lưu bằng lệnh:

   ```powershell
   npx wrangler secret put WORKER_ACCESS_TOKEN --config worker/wrangler.jsonc
   ```

   Không dùng Gemini API key làm access token và không commit hai secret này.

5. Triển khai Worker:

   ```powershell
   npx wrangler deploy --config worker/wrangler.jsonc
   ```

   Lệnh sẽ hiển thị địa chỉ Worker. Mở **Thư viện tài liệu** trên website, nhập URL Worker và access token để kết nối.

Tài liệu gốc được giữ trong IndexedDB của trình duyệt. Gemini xử lý một bản tạm khi bạn chủ động bấm tạo câu hỏi; Worker yêu cầu xóa file tạm sau đó. Theo [Gemini Files API](https://ai.google.dev/gemini-api/docs/files), file được tự động xóa sau 48 giờ nếu việc xóa thủ công thất bại. API có thể phát sinh chi phí theo tài khoản Gemini.

Worker giới hạn file 20 MB, hỗ trợ PDF, ảnh và các định dạng âm thanh phổ biến. Hãy xem lại câu hỏi/đáp án do AI tạo trước khi lưu vào thư viện.

Nếu Gemini không nhận model mặc định, đổi giá trị `GEMINI_MODEL` trong `worker/wrangler.jsonc` sang một model Interactions API đang hỗ trợ rồi triển khai Worker lại.
