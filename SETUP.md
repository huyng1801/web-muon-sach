# 🚀 Hướng dẫn Setup và Chạy Project

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 16.x
- **MongoDB**: >= 5.x
- **npm** hoặc **yarn**

## 🔧 Cài đặt Backend

### Bước 1: Setup MongoDB

**Option 1: MongoDB Local**
```bash
# Windows: Tải và cài đặt MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Sau khi cài đặt, MongoDB sẽ chạy tại mongodb://localhost:27017
```

**Option 2: MongoDB Atlas (Cloud)**
```bash
# 1. Tạo tài khoản tại https://www.mongodb.com/cloud/atlas
# 2. Tạo cluster miễn phí
# 3. Lấy connection string
# 4. Thay đổi trong backend/.env
```

### Bước 2: Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env
```

### Bước 3: Cấu hình Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/library_management

# Server
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Environment
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### Bước 4: Seed Database (Tạo dữ liệu mẫu)

```bash
# Chạy script seed để tạo dữ liệu mẫu
node seed.js
```

**Dữ liệu được tạo:**
- 5 Nhà xuất bản
- 10 Sách
- 3 Nhân viên (1 Admin, 1 Thủ thư, 1 Nhân viên)
- 5 Độc giả
- 7 Bản ghi mượn sách

### Bước 5: Chạy Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

## 🎨 Cài đặt Frontend

### Bước 1: Cài đặt Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env
```

### Bước 2: Cấu hình Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Bước 3: Chạy Frontend

```bash
# Development mode
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

## 🧪 Kiểm tra hoạt động

### Test Backend

```bash
# Test API endpoint
curl http://localhost:5000/api/sach
```

Hoặc mở trình duyệt: `http://localhost:5000/api/sach`

### Test Frontend

Mở trình duyệt: `http://localhost:5173`

## 👤 Tài khoản đăng nhập

### Nhân viên

**Admin:**
- Số điện thoại: `0901234567`
- Mật khẩu: `123456`

**Thủ thư:**
- Số điện thoại: `0912345678`
- Mật khẩu: `123456`

**Nhân viên:**
- Số điện thoại: `0923456789`
- Mật khẩu: `123456`

### Độc giả

Đăng ký tài khoản mới tại: `http://localhost:5173/register`

Hoặc sử dụng tài khoản từ seed:
- Email: `docgia1@example.com` (không có login endpoint cho độc giả - cần bổ sung)

## 📂 Cấu trúc Project

```
web-muon-sach/
├── backend/                # Backend API (Node.js + Express + MongoDB)
│   ├── models/            # Mongoose models
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation middleware
│   ├── config/            # Database config
│   ├── index.js           # Server entry point
│   ├── seed.js            # Database seeding script
│   ├── package.json
│   └── .env
│
├── frontend/              # Frontend (Vue.js 3 + Vite)
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Pinia stores
│   │   ├── router/       # Vue Router
│   │   ├── assets/       # CSS, images
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── README.md             # Main documentation
└── SETUP.md              # This file
```

## 🔍 Workflow hoàn chỉnh

### 1. Nhân viên đăng nhập

1. Mở `http://localhost:5173/login`
2. Chọn tab "Nhân viên"
3. Nhập: `0901234567` / `admin123`
4. Đăng nhập thành công → Redirect to `/admin/dashboard`

### 2. Độc giả đăng ký

1. Mở `http://localhost:5173/register`
2. Điền form đăng ký
3. Submit → Tạo tài khoản độc giả mới
4. Redirect to `/login`

### 3. Độc giả mượn sách

1. Login (chức năng đang phát triển)
2. Vào `/reader/books` - Xem danh sách sách
3. Click "Xem chi tiết" → `/reader/books/:id`
4. Click "Đăng ký mượn" → Tạo yêu cầu mượn sách
5. Trạng thái: "Chờ duyệt"

### 4. Nhân viên duyệt yêu cầu

1. Login với tài khoản nhân viên
2. Vào `/admin/muonsach`
3. Tab "Chờ duyệt" → Xem danh sách yêu cầu
4. Click "Duyệt" → Nhập ngày mượn, hạn trả
5. Xác nhận → Trạng thái: "Đã duyệt"

### 5. Độc giả trả sách

1. Nhân viên vào `/admin/muonsach`
2. Tab "Đang mượn"
3. Click "Trả sách" → Nhập ngày trả thực tế
4. Xác nhận → Trạng thái: "Đã trả"

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Cannot connect to MongoDB"

**Nguyên nhân:** MongoDB chưa chạy hoặc connection string sai

**Giải pháp:**
```bash
# Windows: Kiểm tra MongoDB service
services.msc

# Hoặc chạy MongoDB manually
mongod --dbpath="C:\data\db"

# Kiểm tra connection string trong backend/.env
MONGODB_URI=mongodb://localhost:27017/library_management
```

### Lỗi: "Network Error" hoặc "CORS Error"

**Nguyên nhân:** Backend chưa chạy hoặc CORS chưa được cấu hình

**Giải pháp:**
```bash
# 1. Kiểm tra backend đang chạy
# Backend phải chạy ở port 5000

# 2. Kiểm tra CORS trong backend/index.js
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}
app.use(cors(corsOptions))

# 3. Kiểm tra VITE_API_URL trong frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### Lỗi: "Module not found"

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port already in use"

**Giải pháp:**
```bash
# Windows: Tìm và kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc thay đổi port trong .env
PORT=5001
```

## 📊 API Endpoints

### Authentication
- `POST /api/nhanvien/login` - Đăng nhập nhân viên
- `POST /api/docgia/register` - Đăng ký độc giả

### Sách
- `GET /api/sach` - Lấy danh sách sách
- `GET /api/sach/:id` - Lấy chi tiết sách
- `POST /api/sach` - Tạo sách mới (Admin/Thủ thư)
- `PUT /api/sach/:id` - Cập nhật sách (Admin/Thủ thư)
- `DELETE /api/sach/:id` - Xóa sách (Admin)

### Độc giả
- `GET /api/docgia` - Lấy danh sách độc giả (Admin)
- `GET /api/docgia/:id` - Lấy chi tiết độc giả
- `PUT /api/docgia/:id` - Cập nhật độc giả

### Mượn sách
- `GET /api/theodoimuonsach` - Lấy danh sách mượn sách
- `POST /api/theodoimuonsach` - Tạo yêu cầu mượn (Độc giả)
- `PUT /api/theodoimuonsach/:id/approve` - Duyệt yêu cầu (Admin/Thủ thư)
- `PUT /api/theodoimuonsach/:id/return` - Trả sách (Admin/Thủ thư)

## 📚 Tài liệu tham khảo

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/)

## 🎓 Học thêm

### Backend
- RESTful API design
- JWT Authentication
- MongoDB & Mongoose
- Express.js middleware

### Frontend
- Vue.js 3 Composition API
- Pinia State Management
- Vue Router
- Axios HTTP Client

## 📝 Ghi chú

1. **Development**: Đang phát triển chức năng đăng nhập cho độc giả
2. **Production**: Cần thay đổi JWT_SECRET và sử dụng HTTPS
3. **Security**: Thêm rate limiting và input validation
4. **Performance**: Thêm caching và pagination

## 🤝 Đóng góp

Nếu bạn muốn đóng góp:
1. Fork repository
2. Tạo branch mới
3. Commit changes
4. Push to branch
5. Tạo Pull Request

---

**Chúc bạn code vui vẻ! 🎉**
