# Frontend - Hệ Thống Mượn Sách Online

Frontend được xây dựng bằng **Vue.js 3**, **Vite**, **Pinia**, **Vue Router**, và **Bootstrap 5**.

## 🚀 Cài đặt

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
```

## 🔧 Cấu hình

Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

Cấu hình trong `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## 📦 Scripts

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # CSS, images
│   │   └── css/
│   │       └── style.css
│   ├── components/     # Vue components
│   │   ├── Admin/      # Admin-only components
│   │   ├── Reader/     # Reader-only components
│   │   └── Common/     # Shared components
│   │       ├── Navbar.vue
│   │       ├── Sidebar.vue
│   │       ├── Footer.vue
│   │       └── Loading.vue
│   ├── views/          # Page components
│   │   ├── Admin/      # Admin pages
│   │   │   ├── AdminLayout.vue
│   │   │   ├── DashboardPage.vue
│   │   │   ├── SachPage.vue
│   │   │   ├── DocGiaPage.vue
│   │   │   ├── NhaXuatBanPage.vue
│   │   │   ├── MuonSachPage.vue
│   │   │   └── NhanVienPage.vue
│   │   ├── Reader/     # Reader pages
│   │   │   ├── ReaderLayout.vue
│   │   │   ├── DanhSachSachPage.vue
│   │   │   ├── ChiTietSachPage.vue
│   │   │   ├── DangKyMuonPage.vue
│   │   │   └── LichSuMuonPage.vue
│   │   ├── Auth/       # Authentication pages
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   └── ProfilePage.vue
│   │   └── Error/      # Error pages
│   │       ├── NotFoundPage.vue
│   │       └── UnauthorizedPage.vue
│   ├── services/       # API service layer
│   │   ├── api.js
│   │   ├── docgiaService.js
│   │   ├── sachService.js
│   │   ├── nhaxuatbanService.js
│   │   ├── theodoimuonsachService.js
│   │   └── nhanvienService.js
│   ├── store/          # Pinia stores
│   │   ├── authStore.js
│   │   ├── docgiaStore.js
│   │   ├── sachStore.js
│   │   ├── nhaxuatbanStore.js
│   │   └── theodoimuonsachStore.js
│   ├── router/         # Vue Router
│   │   └── index.js
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🎨 Công nghệ sử dụng

- **Vue.js 3.4.0** - Progressive JavaScript Framework
- **Vite 5.0.8** - Next Generation Frontend Tooling
- **Pinia 2.1.7** - State Management
- **Vue Router 4.2.5** - Official Router
- **Axios 1.6.2** - HTTP Client
- **Bootstrap 5.3.2** - CSS Framework
- **Bootstrap Icons 1.11.2** - Icon Library

## 🔐 Phân quyền

### Nhân viên (Admin/Thủ thư/Nhân viên)
- Đăng nhập vào `/login` (tab "Nhân viên")
- Truy cập `/admin/*` routes
- Dashboard, quản lý sách, độc giả, mượn sách, nhà xuất bản
- Admin có thêm quyền quản lý nhân viên

### Độc giả
- Đăng ký tài khoản tại `/register`
- Đăng nhập vào `/login` (tab "Độc giả" - đang phát triển)
- Truy cập `/reader/*` routes
- Xem danh sách sách, đăng ký mượn sách, xem lịch sử

## 🛣️ Routes

### Public Routes
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký độc giả

### Admin Routes (Yêu cầu quyền Nhân viên)
- `/admin/dashboard` - Dashboard tổng quan
- `/admin/sach` - Quản lý sách
- `/admin/docgia` - Quản lý độc giả
- `/admin/nhaxuatban` - Quản lý nhà xuất bản
- `/admin/muonsach` - Quản lý mượn sách
- `/admin/nhanvien` - Quản lý nhân viên (Chỉ Admin)
- `/admin/profile` - Thông tin cá nhân

### Reader Routes (Yêu cầu quyền Độc giả)
- `/reader/books` - Danh sách sách
- `/reader/books/:id` - Chi tiết sách
- `/reader/borrow` - Đăng ký mượn sách
- `/reader/history` - Lịch sử mượn sách
- `/reader/profile` - Thông tin cá nhân

### Error Routes
- `/401` - Unauthorized (Không có quyền)
- `/404` - Not Found (Trang không tồn tại)

## 🔒 Authentication Flow

1. **Login**: Gọi API login → Nhận JWT token
2. **Store**: Lưu token + user info vào localStorage
3. **Axios Interceptor**: Tự động gắn token vào header
4. **Route Guard**: Kiểm tra quyền trước khi truy cập route
5. **Auto Logout**: Tự động logout khi token hết hạn (401)

## 📡 API Integration

Tất cả API calls được xử lý qua `services/` layer:

```javascript
// Example: Gọi API lấy danh sách sách
import { sachService } from '@/services/sachService'

const sachs = await sachService.getAll({ page: 1, limit: 10 })
```

Axios interceptors tự động:
- Gắn JWT token vào Authorization header
- Xử lý lỗi 401 (redirect to login)
- Xử lý lỗi 403 (redirect to /401)

## 🎯 State Management

Pinia stores quản lý state toàn cục:

```javascript
// Example: Sử dụng Auth Store
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
authStore.loginNhanVien({ SoDienThoai, Password })
```

## 🎨 Styling

- **Bootstrap 5.3.2**: Grid system, components
- **Custom CSS**: `src/assets/css/style.css`
- **Bootstrap Icons**: Icon library
- **Scoped Styles**: Component-specific styles

## 📝 Tài khoản test

### Nhân viên (từ seed.js)
```
Số điện thoại: 0901234567
Mật khẩu: admin123
Chức vụ: Admin
```

```
Số điện thoại: 0902345678
Mật khẩu: thuthu123
Chức vụ: Thủ thư
```

### Độc giả
Đăng ký tài khoản mới tại `/register`

## 🚨 Lưu ý

1. **Backend phải chạy trước**: Đảm bảo backend đang chạy ở `http://localhost:5000`
2. **CORS**: Backend đã cấu hình CORS cho `http://localhost:5173`
3. **Token Storage**: JWT token lưu trong localStorage
4. **Route Guards**: Tự động redirect nếu không có quyền

## 🛠️ Development

```bash
# Chạy dev server
npm run dev

# Server sẽ chạy tại http://localhost:5173
# Hot Module Replacement (HMR) được bật sẵn
```

## 📦 Production Build

```bash
# Build for production
npm run build

# Files được build vào thư mục dist/
# Deploy thư mục dist/ lên server
```

## 🔍 Debugging

1. **Vue DevTools**: Cài extension Vue.js devtools
2. **Network Tab**: Kiểm tra API calls
3. **Console Logs**: Xem errors trong browser console
4. **Vite HMR**: Auto reload khi code thay đổi

## 📞 Hỗ trợ

Nếu gặp lỗi:
1. Kiểm tra backend đang chạy
2. Kiểm tra `.env` đúng cấu hình
3. Clear browser cache và localStorage
4. Xóa `node_modules` và `npm install` lại

---

**Version**: 1.0.0  
**Last Updated**: 2024
