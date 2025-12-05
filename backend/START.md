# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (copy từ .env.example)
copy .env.example .env

# 4. Chỉnh sửa file .env với thông tin MongoDB của bạn

# 5. Seed dữ liệu mẫu (tùy chọn)
npm run seed

# 6. Chạy server development
npm run dev

# Hoặc chạy production
npm start