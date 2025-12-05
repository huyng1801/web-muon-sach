# Website Đăng Ký Mượn Sách Online

## Mô Tả Dự Án
Website quản lý mượn sách online cho thư viện, giúp độc giả có thể đăng ký mượn sách trực tuyến. Hệ thống được xây dựng bằng MEVN stack (MongoDB, Express, Vue.js, Node.js).

## Công Nghệ Sử Dụng
- **Frontend**: Vue.js 3, Vite, Axios, Bootstrap 5
- **Backend**: Node.js, Express.js (JavaScript)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs

## Cấu Trúc Cơ Sở Dữ Liệu

### 1. Bảng DocGia (Độc Giả)
Lưu thông tin của độc giả (người mượn sách). Mỗi độc giả có một mã số để quản lý và có các thông tin về họ lót, tên, ngày sinh, địa chỉ, điện thoại, tài khoản đăng nhập.

**Tên bảng**: `DocGia`

| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ràng Buộc |
|---------|------------|-------|----------|
| **_id** | ObjectId | Mã số độc giả | Primary Key, Unique |
| **HoLot** | String | Họ lót | Required |
| **Ten** | String | Tên | Required |
| **Email** | String | Email/Tên tài khoản | Required, Unique |
| **Password** | String | Mật khẩu (mã hóa) | Required |
| **NgaySinh** | Date | Ngày sinh | Optional |
| **Phai** | String | Giới tính (Nam/Nữ) | Optional |
| **DiaChi** | String | Địa chỉ | Required |
| **DienThoai** | String | Số điện thoại | Required, Unique |
| **TrangThai** | String | Trạng thái (Hoạt động/Khóa) | Default: "Hoạt động" |
| **NgayDangKy** | Date | Ngày đăng ký | Default: now |

### 2. Bảng Sach (Sách)
Lưu thông tin về sách. Mỗi sách có một mã số để quản lý và có tên, giá tiền, số quyển, năm xuất bản, nhà xuất bản, nguồn gốc hay tác giả của sách.

**Tên bảng**: `Sach`

| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ràng Buộc |
|---------|------------|-------|----------|
| **_id** | ObjectId | Mã số sách | Primary Key, Unique |
| **TenSach** | String | Tên sách | Required |
| **ISBN** | String | Mã ISBN | Optional, Unique |
| **DonGia** | Number | Giá tiền | Required |
| **SoQuyen** | Number | Số quyển có sẵn | Required |
| **NamXuatBan** | Number | Năm xuất bản | Optional |
| **MaNXB** | ObjectId | _id nhà xuất bản | Foreign Key → NhaXuatBan |
| **NguonGoc_TacGia** | String | Nguồn gốc hoặc tác giả | Optional |
| **NgayThem** | Date | Ngày thêm sách | Default: now |

### 3. Bảng NhaXuatBan (Nhà Xuất Bản)
Lưu thông tin về nhà xuất bản. Mỗi nhà xuất bản có một mã số để quản lý, và có tên gọi, địa chỉ của nhà xuất bản.

**Tên bảng**: `NhaXuatBan`

| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ràng Buộc |
|---------|------------|-------|----------|
| **_id** | ObjectId | Mã nhà xuất bản | Primary Key, Unique |
| **TenNXB** | String | Tên nhà xuất bản | Required |
| **DiaChi** | String | Địa chỉ | Required |

### 4. Bảng TheoDoiMuonSach (Theo Dõi Mượn Sách)
Lưu thông tin theo dõi độc giả mượn sách. Thông tin gồm: độc giả nào, mượn sách gì, mượn vào ngày nào, trả sách vào ngày nào.

**Tên bảng**: `TheoDoiMuonSach`

| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ràng Buộc |
|---------|------------|-------|----------|
| **_id** | ObjectId | ID duy nhất | Primary Key |
| **MaDocGia** | ObjectId | _id độc giả | Foreign Key → DocGia, Required |
| **MaSach** | ObjectId | _id sách | Foreign Key → Sach, Required |
| **NgayMuon** | Date | Ngày mượn | Required |
| **NgayTra** | Date | Ngày trả | Optional |
| **TrangThai** | String | Trạng thái (Đang mượn/Đã trả) | Default: "Đang mượn" |

### 5. Bảng NhanVien (Nhân Viên)
Lưu thông tin nhân viên quản lý hệ thống. Mỗi nhân viên có một mã số nhân viên để quản lý và các thông tin họ tên, chức vụ, địa chỉ và số điện thoại.

**Tên bảng**: `NhanVien`

| Tên Cột | Kiểu Dữ Liệu | Mô Tả | Ràng Buộc |
|---------|------------|-------|----------|
| **_id** | ObjectId | Mã số nhân viên | Primary Key, Unique |
| **HoTenNV** | String | Họ tên nhân viên | Required |
| **Password** | String | Mật khẩu (mã hóa) | Required |
| **Chucvu** | String | Chức vụ | Required |
| **DiaChi** | String | Địa chỉ | Optional |
| **SoDienThoai** | String | Số điện thoại | Optional, Unique |
| **NgayThamGia** | Date | Ngày tham gia | Default: now |

## Phân Quyền (Authorization)

### Vai Trò Người Dùng
1. **Quản Trị Viên (Admin)** - Nhân viên quản lý:
   - Quản lý toàn bộ dữ liệu (độc giả, sách, nhà xuất bản, lịch sử mượn)
   - Quản lý tài khoản nhân viên
   - Xem báo cáo, thống kê

2. **Thủ Thư (Librarian)** - Nhân viên hỗ trợ:
   - Quản lý sách, nhà xuất bản
   - Xử lý yêu cầu mượn/trả sách
   - Xem thông tin độc giả

3. **Độc Giả (Reader)** - Người mượn sách:
   - Xem danh sách sách
   - Tìm kiếm sách
   - Đăng ký mượn sách
   - Xem lịch sử mượn sách của mình
   - Cập nhật thông tin cá nhân

## Mô Hình Dữ Liệu MongoDB

Mặc dù sử dụng MongoDB (NoSQL), hệ thống vẫn tuân theo cấu trúc schema như trên để đảm bảo tính nhất quán dữ liệu. Dưới đây là các ví dụ JSON schema cho MongoDB:

### Document DocGia
```javascript
{
  "_id": ObjectId("656a1b2c3d4e5f6a7b8c9d0e"),
  "HoLot": "Nguyễn",
  "Ten": "Văn A",
  "Email": "vana@example.com",
  "Password": "$2b$10$...", // bcrypt hash
  "NgaySinh": "1995-05-15",
  "Phai": "Nam",
  "DiaChi": "123 Đường ABC, TP.HCM",
  "DienThoai": "0123456789",
  "TrangThai": "Hoạt động",
  "NgayDangKy": ISODate("2024-01-15T00:00:00Z")
}
```

### Document Sach
```javascript
{
  "_id": ObjectId("656a1b2c3d4e5f6a7b8c9d0f"),
  "TenSach": "Lập trình JavaScript",
  "ISBN": "978-604-77-1234-5",
  "DonGia": 150000,
  "SoQuyen": 10,
  "NamXuatBan": 2023,
  "MaNXB": ObjectId("656a1b2c3d4e5f6a7b8c9d10"),
  "NguonGoc_TacGia": "Kyle Simpson",
  "NgayThem": ISODate("2024-01-01T00:00:00Z")
}
```

### Document NhaXuatBan
```javascript
{
  "_id": ObjectId("656a1b2c3d4e5f6a7b8c9d10"),
  "TenNXB": "Nhà Xuất Bản Đại Học",
  "DiaChi": "456 Đường XYZ, Hà Nội"
}
```

### Document TheoDoiMuonSach
```javascript
{
  "_id": ObjectId("656a1b2c3d4e5f6a7b8c9d11"),
  "MaDocGia": ObjectId("656a1b2c3d4e5f6a7b8c9d0e"),
  "MaSach": ObjectId("656a1b2c3d4e5f6a7b8c9d0f"),
  "NgayMuon": ISODate("2024-12-01T00:00:00Z"),
  "NgayTra": ISODate("2024-12-15T00:00:00Z"),
  "TrangThai": "Đã trả"
}
```

### Document NhanVien
```javascript
{
  "_id": ObjectId("656a1b2c3d4e5f6a7b8c9d12"),
  "HoTenNV": "Trần Văn B",
  "Password": "$2b$10$...", // bcrypt hash
  "Chucvu": "Thủ thư",
  "DiaChi": "789 Đường DEF, TP.HCM",
  "SoDienThoai": "0987654321",
  "NgayThamGia": ISODate("2023-06-01T00:00:00Z")
}
```

## Các Quan Hệ Giữa Các Bảng

```
┌──────────────┐
│  NhaXuatBan  │
│  (MaNXB)     │
└──────┬───────┘
       │ (Foreign Key)
       │
       ▼
┌──────────────┐
│    Sach      │
│  (MaSach)    │
└──────┬───────┘
       │ (Foreign Key)
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐     ┌──────────────┐
│   DocGia     │     │TheoDoiMuonS..│
│(MaDocGia)    │     │ (MaDocGia,   │
└──────────────┘     │  MaSach)     │
       ▲              └──────────────┘
       │ (Foreign Key)      │
       └────────────────────┘
```

## Cấu Trúc Thư Mục

```
web-muon-sach/
│
├── backend/                              # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js                  # Kết nối MongoDB
│   │
│   ├── models/                          # MongoDB Schemas
│   │   ├── DocGia.js                    # Model độc giả
│   │   ├── Sach.js                      # Model sách
│   │   ├── NhaXuatBan.js                # Model nhà xuất bản
│   │   ├── TheoDoiMuonSach.js           # Model theo dõi mượn sách
│   │   └── NhanVien.js                  # Model nhân viên
│   │
│   ├── controllers/                     # Business Logic
│   │   ├── docgiaController.js          # Xử lý CRUD độc giả
│   │   ├── sachController.js            # Xử lý CRUD sách
│   │   ├── nhaxuatbanController.js      # Xử lý CRUD nhà xuất bản
│   │   ├── theodoimuonsachController.js # Xử lý mượn/trả sách
│   │   └── nhanvienController.js        # Xử lý auth và quản lý nhân viên
│   │
│   ├── routes/                          # API Endpoints
│   │   ├── docgia.js                    # Route độc giả
│   │   ├── sach.js                      # Route sách
│   │   ├── nhaxuatban.js                # Route nhà xuất bản
│   │   ├── theodoimuonsach.js           # Route mượn sách
│   │   └── nhanvien.js                  # Route nhân viên
│   │
│   ├── middleware/                      # Middleware
│   │   ├── auth.js                      # JWT authentication
│   │   └── validation.js                # Input validation
│   │
│   ├── server.js                         # Entry point Server
│   ├── .env                             # Environment variables
│   ├── .env.example                     # Ví dụ .env
│   └── package.json                     # Dependencies server
│
├── frontend/                              # Frontend (Vue.js 3 + Vite)
│   ├── src/
│   │   ├── components/                  # Vue Components
│   │   │   ├── Admin/                   # Components cho nhân viên/Admin
│   │   │   │   ├── DocGia/
│   │   │   │   │   ├── DocGiaList.vue       # Danh sách độc giả (Admin/Staff)
│   │   │   │   │   ├── DocGiaForm.vue       # Form thêm/sửa độc giả (Admin/Staff)
│   │   │   │   │   └── DocGiaDetail.vue     # Chi tiết độc giả (Admin/Staff)
│   │   │   │   ├── Sach/
│   │   │   │   │   ├── SachList.vue         # Danh sách sách (Admin/Staff)
│   │   │   │   │   ├── SachForm.vue         # Form thêm/sửa sách (Admin/Staff)
│   │   │   │   │   └── SachDetail.vue       # Chi tiết sách (Admin/Staff)
│   │   │   │   ├── NhaXuatBan/
│   │   │   │   │   ├── NhaXuatBanList.vue   # Danh sách NXB (Admin/Staff)
│   │   │   │   │   ├── NhaXuatBanForm.vue   # Form thêm/sửa NXB (Admin/Staff)
│   │   │   │   │   └── NhaXuatBanDetail.vue # Chi tiết NXB (Admin/Staff)
│   │   │   │   ├── TheoDoiMuonSach/
│   │   │   │   │   ├── MuonSachForm.vue     # Form duyệt mượn sách (Admin/Staff)
│   │   │   │   │   ├── LichSuMuon.vue       # Lịch sử mượn sách (Admin/Staff)
│   │   │   │   │   └── TraSachForm.vue      # Form ghi nhận trả sách (Admin/Staff)
│   │   │   │   ├── NhanVien/
│   │   │   │   │   ├── NhanVienList.vue     # Danh sách nhân viên (Admin)
│   │   │   │   │   └── NhanVienForm.vue     # Form thêm/sửa nhân viên (Admin)
│   │   │   │
│   │   │   ├── Reader/                  # Components cho độc giả
│   │   │   │   ├── Sach/
│   │   │   │   │   ├── SachList.vue         # Danh sách sách (Độc giả)
│   │   │   │   │   ├── SachDetail.vue       # Chi tiết sách (Độc giả)
│   │   │   │   ├── MuonSach/
│   │   │   │   │   ├── DangKyMuonForm.vue   # Form đăng ký mượn sách (Độc giả)
│   │   │   │   │   ├── LichSuMuon.vue       # Lịch sử mượn sách (Độc giả)
│   │   │   │   ├── Profile/
│   │   │   │   │   ├── ProfileInfo.vue      # Thông tin cá nhân (Độc giả)
│   │   │   │   │   └── ChangePassword.vue   # Đổi mật khẩu (Độc giả)
│   │   │   │
│   │   │   ├── Common/
│   │   │   │   ├── Navbar.vue           # Menu bar
│   │   │   │   ├── Sidebar.vue          # Sidebar navigation
│   │   │   │   ├── Footer.vue           # Footer
│   │   │   │   └── Loading.vue          # Loading spinner
│   │   │
│   │   ├── views/                       # Pages
│   │   │   ├── LoginPage.vue            # Trang đăng nhập (NV/DG)
│   │   │   ├── RegisterPage.vue         # Trang đăng ký (độc giả)
│   │   │   ├── ProfilePage.vue          # Trang hồ sơ cá nhân
│   │   │   │
│   │   │   ├── Admin/                   # Trang dành cho nhân viên/Admin
│   │   │   │   ├── DashboardPage.vue        # Trang dashboard (cho NV)
│   │   │   │   ├── DocGiaPage.vue           # Trang quản lý độc giả (NV)
│   │   │   │   ├── SachPage.vue             # Trang quản lý sách (NV)
│   │   │   │   ├── NhaXuatBanPage.vue       # Trang quản lý NXB (NV)
│   │   │   │   ├── TheoDoiMuonSachPage.vue  # Trang xử lý mượn/trả (NV)
│   │   │   │   ├── NhanVienPage.vue         # Trang quản lý nhân viên (Admin)
│   │   │   │
│   │   │   ├── Reader/                  # Trang dành cho độc giả
│   │   │   │   ├── DanhSachSachPage.vue     # Xem danh sách sách
│   │   │   │   ├── TimKiemSachPage.vue      # Tìm kiếm sách
│   │   │   │   ├── DangKyMuonPage.vue       # Đăng ký mượn sách
│   │   │   │   ├── LichSuMuonPage.vue       # Xem lịch sử mượn sách
│   │   │   │
│   │   │   ├── NotFoundPage.vue         # Trang 404
│   │   │   └── UnauthorizedPage.vue     # Trang 401
│   │   │
│   │   ├── services/                    # API Services
│   │   │   ├── api.js                   # Axios instance & config
│   │   │   ├── docgiaService.js         # API calls độc giả
│   │   │   ├── sachService.js           # API calls sách
│   │   │   ├── nhaxuatbanService.js     # API calls NXB
│   │   │   ├── theodoimuonsachService.js# API calls mượn sách
│   │   │   └── nhanvienService.js       # API calls nhân viên
│   │   │
│   │   ├── store/                       # Pinia Store
│   │   │   ├── index.js                 # Store config
│   │   │   ├── authStore.js             # Auth state (login, user info, role)
│   │   │   ├── docgiaStore.js           # Độc giả state (for admin/staff)
│   │   │   ├── sachStore.js             # Sách state
│   │   │   ├── nhaxuatbanStore.js       # NXB state
│   │   │   └── theodoimuonsachStore.js  # Mượn sách state
│   │   │
│   │   ├── assets/                      # Static assets
│   │   │   ├── css/
│   │   │   │   └── style.css            # Global styles
│   │   │   ├── images/
│   │   │   │   └── logo.png
│   │   │   └── fonts/
│   │   │
│   │   ├── router/
│   │   │   └── index.js                 # Vue Router config
│   │   │
│   │   ├── App.vue                      # Root component
│   │   └── main.js                      # Entry point Vue
│   │
│   ├── public/
│   │   └── favicon.ico                  # Favicon
│   │
│   ├── index.html                       # HTML template
│   ├── vite.config.js                   # Vite config
│   ├── package.json                     # Dependencies client
│   └── .env.example
│
├── .gitignore                           # Git ignore
├── package.json                         # Root package.json
└── README.md                            # Documentation
```

### Giải Thích Cấu Trúc

#### Backend (`backend/`)
- **config/**: Cấu hình ứng dụng (kết nối DB, biến môi trường)
- **models/**: Định nghĩa schema MongoDB cho từng entity
- **controllers/**: Logic xử lý business, gọi models, trả response
- **routes/**: Định nghĩa API endpoints, gọi controllers
- **middleware/**: Xác thực JWT, validate input, error handling, phân quyền

#### Frontend (`frontend/`)
**components/**: UI components tái sử dụng, chia theo phân quyền:
   - **Admin/**: Components cho nhân viên/Admin (quản lý độc giả, sách, NXB, mượn/trả, nhân viên)
   - **Reader/**: Components cho độc giả (xem/tìm sách, đăng ký mượn, lịch sử, hồ sơ)
   - **Common/**: Components dùng chung (Navbar, Sidebar, Footer, Loading)
**views/**: Trang hoàn chỉnh (kết hợp nhiều components), chia theo phân quyền:
   - **Admin/**: Trang quản lý dữ liệu (nhân viên, sách, độc giả, NXB, mượn/trả)
   - **Reader/**: Trang độc giả (xem/tìm sách, đăng ký mượn, lịch sử, hồ sơ)
- **services/**: Gọi API backend thông qua Axios
- **store/**: Quản lý state toàn ứng dụng bằng Pinia (bao gồm auth state và quyền)
- **router/**: Định nghĩa routes, navigation, route guards (kiểm tra quyền)
- **assets/**: CSS, images, fonts

## Các Chức Năng Chính

### Chức Năng Độc Giả
- ✅ Đăng ký tài khoản (tạo thông tin cá nhân)
- ✅ Đăng nhập với email/tài khoản
- ✅ Xem danh sách sách có sẵn
- ✅ Tìm kiếm sách (theo tên, tác giả, ISBN)
- ✅ Xem chi tiết thông tin sách
- ✅ Đăng ký mượn sách (nếu sách còn quyển)
- ✅ Xem lịch sử mượn sách cá nhân
- ✅ Cập nhật thông tin hồ sơ cá nhân

### Phân Quyền UI (Frontend)
- **Nhân viên/Admin** chỉ truy cập được các components/views trong `Admin/`
- **Độc giả** chỉ truy cập được các components/views trong `Reader/`
- **Common** dùng chung cho cả hai vai trò (Navbar, Sidebar, Footer, Loading)

### Quản Lý Độc Giả (Nhân Viên)
- ✅ Tạo mới độc giả
- ✅ Xem danh sách độc giả
- ✅ Chỉnh sửa thông tin độc giả
- ✅ Khóa/mở khóa tài khoản độc giả
- ✅ Xóa độc giả
- ✅ Tìm kiếm độc giả

### Lưu Ý Khi Phát Triển Component
- **Không dùng chung component quản lý giữa Admin/Reader** (tránh lộ thông tin, sai phân quyền)
- **Các component Reader** chỉ hiển thị thông tin cá nhân, danh sách sách, đăng ký mượn, lịch sử mượn
- **Các component Admin** có đầy đủ CRUD, duyệt mượn, quản lý nhân viên, độc giả, sách, NXB

### Quản Lý Sách
- ✅ Thêm sách mới
- ✅ Xem danh sách sách
- ✅ Chỉnh sửa thông tin sách
- ✅ Xóa sách
- ✅ Tìm kiếm sách
- ✅ Hiển thị số quyển còn lại

### Quản Lý Nhà Xuất Bản
- ✅ Tạo mới nhà xuất bản
- ✅ Xem danh sách nhà xuất bản
- ✅ Chỉnh sửa thông tin nhà xuất bản
- ✅ Xóa nhà xuất bản

### Quản Lý Mượn/Trả Sách (Nhân Viên)
- ✅ Xem danh sách yêu cầu mượn sách chờ duyệt
- ✅ Duyệt/từ chối yêu cầu mượn
- ✅ Ghi nhận ngày trả sách
- ✅ Kiểm tra sách còn quyển hay không
- ✅ Theo dõi trạng thái mượn sách (Chờ duyệt/Đang mượn/Đã trả/Quá hạn)
- ✅ Tính tiền phạt nếu trả trễ

### Quản Lý Nhân Viên
- ✅ Tạo tài khoản nhân viên
- ✅ Đăng nhập nhân viên
- ✅ Chỉnh sửa thông tin nhân viên
- ✅ Xóa tài khoản nhân viên
- ✅ Phân quyền chức vụ

## Hướng Dẫn Cài Đặt

#### Yêu Cầu
- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

#### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd web-muon-sach
```

#### Bước 2: Cài Đặt Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

#### Bước 3: Cấu Hình Environment Variables
Tạo file `.env` trong thư mục `backend/`:
```
MONGODB_URI=mongodb://localhost:27017/web-muon-sach
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Tạo file `.env` trong thư mục `frontend/`:
```
VITE_API_URL=http://localhost:5000/api
```

#### Bước 4: Tạo Dữ Liệu Mẫu (Optional)
Tạo tài khoản admin mẫu:
```javascript
// Chạy script seed dữ liệu (nếu có)
node backend/seed.js
```

#### Bước 5: Chạy Ứng Dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

#### Tài Khoản Mẫu
**Nhân Viên (Admin)**:
- Email: admin@library.com
- Password: admin123

**Độc Giả Mẫu**:
- Email: reader@example.com
- Password: reader123

## API Endpoints

### Authentication (Độc Giả)
- `POST /api/docgia/register` - Đăng ký tài khoản độc giả
- `POST /api/docgia/login` - Đăng nhập độc giả
- `POST /api/docgia/logout` - Đăng xuất
- `GET /api/docgia/profile` - Lấy thông tin hồ sơ cá nhân (cần JWT)
- `PUT /api/docgia/profile` - Cập nhật thông tin cá nhân (cần JWT)
- `POST /api/docgia/change-password` - Đổi mật khẩu (cần JWT)

### Quản Lý Độc Giả (Nhân Viên)
- `GET /api/docgia` - Lấy danh sách độc giả (yêu cầu quyền Staff)
- `GET /api/docgia/:id` - Lấy thông tin độc giả (yêu cầu quyền Staff)
- `POST /api/docgia` - Tạo độc giả mới (yêu cầu quyền Admin)
- `PUT /api/docgia/:id` - Cập nhật độc giả (yêu cầu quyền Staff)
- `PATCH /api/docgia/:id/status` - Khóa/mở khóa tài khoản (yêu cầu quyền Admin)
- `DELETE /api/docgia/:id` - Xóa độc giả (yêu cầu quyền Admin)

### Sách
- `GET /api/sach` - Lấy danh sách sách
- `GET /api/sach/:id` - Lấy thông tin sách
- `POST /api/sach` - Tạo sách mới
- `PUT /api/sach/:id` - Cập nhật sách
- `DELETE /api/sach/:id` - Xóa sách

### Nhà Xuất Bản
- `GET /api/nhaxuatban` - Lấy danh sách nhà xuất bản
- `GET /api/nhaxuatban/:id` - Lấy thông tin nhà xuất bản
- `POST /api/nhaxuatban` - Tạo nhà xuất bản mới
- `PUT /api/nhaxuatban/:id` - Cập nhật nhà xuất bản
- `DELETE /api/nhaxuatban/:id` - Xóa nhà xuất bản

### Theo Dõi Mượn Sách
- `GET /api/theodoimuonsach` - Lấy danh sách mượn (Admin/Staff có quyền xem tất cả, Độc giả xem của mình)
- `GET /api/theodoimuonsach/:id` - Lấy chi tiết mượn sách
- `POST /api/theodoimuonsach` - Đăng ký mượn sách (Độc giả, cần JWT)
- `GET /api/theodoimuonsach/user/history` - Xem lịch sử mượn sách của bản thân (Độc giả, cần JWT)
- `PUT /api/theodoimuonsach/:id/approve` - Duyệt yêu cầu mượn (Staff)
- `PUT /api/theodoimuonsach/:id/reject` - Từ chối yêu cầu mượn (Staff)
- `PUT /api/theodoimuonsach/:id/return` - Ghi nhận trả sách (Staff)
- `DELETE /api/theodoimuonsach/:id` - Xóa record mượn sách (Admin)

### Nhân Viên
- `POST /api/nhanvien/register` - Tạo tài khoản nhân viên (yêu cầu quyền Admin)
- `POST /api/nhanvien/login` - Đăng nhập nhân viên
- `POST /api/nhanvien/logout` - Đăng xuất nhân viên
- `GET /api/nhanvien` - Lấy danh sách nhân viên (yêu cầu quyền Admin)
- `GET /api/nhanvien/:id` - Lấy thông tin nhân viên
- `PUT /api/nhanvien/:id` - Cập nhật thông tin nhân viên (yêu cầu quyền Admin)
- `PATCH /api/nhanvien/:id/role` - Thay đổi chức vụ (yêu cầu quyền Admin)
- `DELETE /api/nhanvien/:id` - Xóa nhân viên (yêu cầu quyền Admin)

## Tính Năng Bảo Mật
- ✅ JWT Authentication (Token lưu trong localStorage)
- ✅ Password hashing với bcryptjs (mã hóa 10 rounds)
- ✅ CORS protection (chỉ cho phép từ frontend URL)
- ✅ Input validation (kiểm tra dữ liệu đầu vào)
- ✅ Authorization middleware (phân quyền Role-based)
- ✅ Token expiration (hết hạn sau 7 ngày)
- ✅ Refresh token mechanism (tự động làm mới token)
- ✅ HTTPS recommended cho production
- ✅ Validate email format và phone number
- ✅ Rate limiting (ngăn brute force attack)

## Hướng Dẫn Sử Dụng

### Với Nhân Viên (Admin/Librarian)
1. **Đăng Nhập**: Truy cập `http://localhost:5173/login` và đăng nhập bằng tài khoản nhân viên
2. **Dashboard**: Xem tổng quan (số độc giả, sách, yêu cầu mượn chờ xử lý)
3. **Quản Lý Độc Giả**: 
   - Xem danh sách độc giả
   - Tìm kiếm, lọc độc giả
   - Thêm, sửa, khóa/mở khóa tài khoản
4. **Quản Lý Sách & NXB**:
   - Thêm/sửa/xóa sách
   - Quản lý nhà xuất bản
5. **Xử Lý Mượn/Trả Sách**:
   - Xem yêu cầu mượn chờ duyệt
   - Duyệt/từ chối yêu cầu
   - Ghi nhận sách trả
   - Tính tiền phạt (nếu có)
6. **Quản Lý Nhân Viên (Admin)**:
   - Tạo/xóa tài khoản nhân viên
   - Gán chức vụ

### Với Độc Giả (Reader)
1. **Đăng Ký**:
   - Truy cập `http://localhost:5173/register`
   - Nhập thông tin cá nhân (họ tên, email, mật khẩu, địa chỉ, số điện thoại)
   - Tạo tài khoản

2. **Đăng Nhập**: 
   - Vào trang login, nhập email và mật khẩu
   - Hệ thống lưu token JWT

3. **Duyệt Sách**:
   - Xem danh sách sách có sẵn
   - Tìm kiếm sách (theo tên, tác giả, ISBN)
   - Xem chi tiết sách

4. **Mượn Sách**:
   - Nhấn "Mượn" trên sách cần mượn
   - Hệ thống gửi yêu cầu đến nhân viên
   - Chờ duyệt (trạng thái: "Chờ duyệt")
   - Khi được duyệt: Nhân viên ghi nhận, sách chuyển sang "Đang mượn"

5. **Xem Lịch Sử**:
   - Vào mục "Lịch sử mượn sách"
   - Xem trạng thái từng quyển sách
   - Xem hạn trả sách

6. **Quản Lý Hồ Sơ**:
   - Cập nhật thông tin cá nhân
   - Đổi mật khẩu
   - Xem thông tin tài khoản

## Lưu Ý Quan Trọng
- **Tất cả tên bảng và cột sử dụng tiếng Việt** theo yêu cầu
- **Hệ thống yêu cầu đăng nhập** cho cả nhân viên và độc giả
- **Độc giả phải đăng ký tài khoản** trước khi có thể mượn sách
- **Mượn sách cần được nhân viên duyệt** trước khi chuyển sang trạng thái "Đang mượn"
- **Token JWT hết hạn sau 7 ngày** - độc giả cần đăng nhập lại
- **Mật khẩu được mã hóa bcrypt** - không thể khôi phục, chỉ có thể đặt lại
- **Phân quyền dựa trên vai trò**:
  - `Admin`: Quản lý tất cả + nhân viên
  - `Librarian`: Quản lý sách + xử lý mượn/trả
  - `Reader`: Xem sách + mượn/trả sách
- **Hạn mượn sách**: Mặc định 30 ngày (có thể cấu hình)
- **Phạt quá hạn**: Tính theo ngày (có thể cấu hình mức phạt)

## Support
Nếu có vấn đề, vui lòng liên hệ đội phát triển.

## License
MIT License
