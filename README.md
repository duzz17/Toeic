# TOEIC Master — 7 Parts

Website luyện TOEIC gồm Part 1 đến Part 7. Trang chủ là `index.html`; mỗi phần có trang riêng. Part 3 được biên dịch từ React/TSX bằng Vite khi build.

## Chạy thử trên máy

1. Cài Node.js 22 trở lên.
2. Chạy `npm ci`.
3. Chạy `npm run dev`, rồi mở địa chỉ local mà Vite hiển thị.

## Deploy lên GitHub Pages

1. Tạo repository trên GitHub và tải toàn bộ dự án lên, gồm `index.html`, `part1.html`–`part7.html`, `part3.tsx`, các file cấu hình và thư mục `.github/workflows`.
2. Dùng nhánh `main` hoặc `master`.
3. Trong **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
4. Vào tab **Actions**, chờ workflow **Deploy to GitHub Pages** hoàn tất. Những lần push sau sẽ tự build và deploy lại.

GitHub sẽ hiển thị đường dẫn ở **Settings → Pages**. Địa chỉ thường có dạng:

- Repository thông thường: `https://<ten-tai-khoan>.github.io/<ten-repository>/`
- Repository tên `<ten-tai-khoan>.github.io`: `https://<ten-tai-khoan>.github.io/`

Các trang hiện dùng một số thư viện/font từ CDN; cần Internet để tải chúng. Những file PDF/MP3 được chọn trực tiếp từ máy tính (nếu trang yêu cầu) không cần đưa vào repository.
