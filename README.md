# 📅 Daily Focus - Ứng dụng Quản Lý Thời Gian & Tập Trung Cá Nhân

**Daily Focus** là một ứng dụng web giúp bạn quản lý công việc hàng ngày, cải thiện sự tập trung và tăng năng suất bằng kỹ thuật Pomodoro. Dự án hướng tới việc xây dựng một công cụ cá nhân đơn giản, hiện đại và hiệu quả.

## 🚀 Tính năng chính

### 1. 🧑‍💼 Đăng ký / Đăng nhập
- Xác thực người dùng bằng JWT.
- Đăng nhập với Email/Password hoặc OAuth (Google).
- Lưu trữ thông tin người dùng trong PostgreSQL.

### 2. ✅ Quản lý Task (CRUD)
- **Create:** Tạo task mới (tên, mô tả, deadline).
- **Read:** Hiển thị danh sách task cá nhân.
- **Update:** Chỉnh sửa, đánh dấu hoàn thành.
- **Delete:** Xoá task khi không cần thiết.

### 3. ⏱️ Pomodoro Timer
- Bộ đếm thời gian 25 phút làm việc / 5 phút nghỉ.
- Ghi lại các phiên Pomodoro để thống kê.

### 4. 📊 Thống kê năng suất
- Thống kê số task hoàn thành theo ngày, tuần, tháng.
- Thống kê thời gian làm việc theo Pomodoro sessions.

### 5. 📧 Gửi Email Nhắc Nhở
- Nhắc deadline sắp đến qua email.

### 6. 🎨 UI/UX Hiện Đại
- Giao diện tối giản, đẹp với TailwindCSS.
- Responsive trên mobile, có Dark Mode.
- Hiệu ứng chuyển động mượt mà (Framer Motion).

---

## 🛠️ Công nghệ sử dụng

| Công nghệ        | Mục đích                             |
|------------------|--------------------------------------|
| **Next.js (App Router)** | Frontend + Backend (API routes) |
| **TailwindCSS**  | Thiết kế giao diện nhanh chóng        |
| **TypeScript**   | Code an toàn, dễ bảo trì              |
| **PostgreSQL**   | Lưu trữ người dùng và task            |
| **JWT**          | Xác thực người dùng                   |
| **Nodemailer**   | Gửi email nhắc nhở & chúc mừng        |
| **Framer Motion**| Hiệu ứng chuyển động                  |

---

## 📦 Cài đặt & chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/your-username/daily-focus.git
cd daily-focus
```
### 2. Cài đặt dependencies
```bash
npm install
```
### 3. Thiết lập biến môi trường .env.local
Tạo file .env.local và thêm các biến sau:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/dailyfocus
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```
⚠️ Đảm bảo đã cài và cấu hình PostgreSQL trên máy bạn.

### 4. Khởi tạo Database
```bash
npx prisma migrate dev --name init
```

### 5. Chạy ứng dụng
```bash
npm run dev
```

🛤 Lộ trình phát triển
 ✅ Xác thực người dùng (JWT + Google OAuth)
 ✅ CRUD Task + Deadline
 ✅ Pomodoro Timer hoạt động
 ✅ Thống kê năng suất theo ngày/tuần/tháng
 ✅ Email nhắc nhở và thông báo hoàn thành
 ⏳ Đồng bộ đa thiết bị / đồng bộ thời gian thực
 🔜 Hỗ trợ ngôn ngữ đa dạng (i18n)

🤝 Đóng góp
Bạn có thể đóng góp bằng cách:
Mở issue nếu phát hiện bug
Tạo pull request với tính năng mới
Cải thiện giao diện hoặc hiệu năng

📬 Liên hệ
Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, hãy liên hệ:
Email: atu3012@gmail.com
GitHub: Altas463
