# Hướng Dẫn Chạy Dự Án

## 1. Cài Đặt Dependencies

Trước tiên, bạn cần cài đặt các dependencies của dự án bằng cách chạy lệnh sau:

```sh
npm install --force
```

Lệnh này sẽ tải tất cả các thư viện cần thiết và lưu vào thư mục `node_modules`.

## 2. Cài Đặt MongoDB

Dự án sử dụng **MongoDB** làm cơ sở dữ liệu. Bạn cần tải và cài đặt MongoDB trên máy của mình. Nếu chưa có, bạn có thể tải về từ [trang chủ MongoDB](https://www.mongodb.com/try/download/community).

Sau khi cài đặt, hãy đảm bảo MongoDB đã chạy trên **localhost** với cổng mặc định (`27017`).

## 3. Cấu Hình File Môi Trường `.env`

Tạo một tệp `.env` trong thư mục gốc của dự án và thêm thông tin kết nối MongoDB như sau:

```env
MONGO_URI=mongodb://localhost:27017/official-dispatch-management-web
PORT=3000
```

## 4. Chạy Dự Án

Sau khi đã cài đặt xong, chạy lệnh sau để khởi động server:

```sh
npm run dev
```

Dự án sẽ chạy trên `http://localhost:3000/`.

## 5. Truy Cập Giao Diện Đăng Nhập

Mở trình duyệt và truy cập:

```
http://localhost:3000/
```

Hệ thống sẽ tự động chuyển hướng đến trang **Login**.

### Thông Tin Đăng Nhập Mặc Định:

-   **Email:** `admin@gmail.com`
-   **Mật khẩu:** `123456`

Sau khi đăng nhập thành công, bạn có thể thực hiện các chức năng của hệ thống.

## 6. Các Chức Năng Chính Của Hệ Thống

Sau khi đăng nhập, bạn có thể:

-   Quản lý tài khoản - nhân sự
-   Quản lý công văn đến
-   Quản lý công văn đi
-   Báo cáo và thống kê

## 7. Lưu Ý

-   Đảm bảo MongoDB đang chạy trước khi khởi động dự án.
-   Kiểm tra xem tệp `.env` đã được cấu hình đúng chưa.
-   Nếu gặp lỗi, hãy kiểm tra logs trong terminal để khắc phục.

---
