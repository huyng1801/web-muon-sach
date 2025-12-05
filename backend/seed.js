require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');

// Import models
const DocGia = require('./models/DocGia');
const NhaXuatBan = require('./models/NhaXuatBan');
const Sach = require('./models/Sach');
const NhanVien = require('./models/NhanVien');
const TheoDoiMuonSach = require('./models/TheoDoiMuonSach');

// Kết nối database
connectDB();

// Dữ liệu mẫu
const seedData = async () => {
  try {
    console.log('🔄 Đang xóa dữ liệu cũ...');
    
    // Xóa tất cả dữ liệu cũ
    await DocGia.deleteMany({});
    await NhaXuatBan.deleteMany({});
    await Sach.deleteMany({});
    await NhanVien.deleteMany({});
    await TheoDoiMuonSach.deleteMany({});

    console.log('✅ Đã xóa dữ liệu cũ');
    console.log('🔄 Đang tạo dữ liệu mẫu...');

    // ========== TẠO NHÀ XUẤT BẢN ==========
    const nhaXuatBan = await NhaXuatBan.insertMany([
      {
        TenNXB: 'Nhà Xuất Bản Trẻ',
        DiaChi: '161B Lý Chính Thắng, Quận 3, TP.HCM'
      },
      {
        TenNXB: 'Nhà Xuất Bản Kim Đồng',
        DiaChi: '55 Quang Trung, Hai Bà Trưng, Hà Nội'
      },
      {
        TenNXB: 'Nhà Xuất Bản Giáo Dục',
        DiaChi: '81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'
      },
      {
        TenNXB: 'Nhà Xuất Bản Đại Học Quốc Gia',
        DiaChi: 'Đại học Quốc gia TP.HCM, Phường Linh Trung, TP. Thủ Đức'
      },
      {
        TenNXB: 'Nhà Xuất Bản Văn Học',
        DiaChi: '18 Nguyễn Trường Tộ, Ba Đình, Hà Nội'
      }
    ]);

    console.log(`✅ Đã tạo ${nhaXuatBan.length} nhà xuất bản`);

    // ========== TẠO SÁCH ==========
    const sach = await Sach.insertMany([
      {
        TenSach: 'Đắc Nhân Tâm',
        ISBN: '978-604-2-13121-4',
        DonGia: 86000,
        SoQuyen: 25,
        NamXuatBan: 2020,
        MaNXB: nhaXuatBan[0]._id,
        NguonGoc_TacGia: 'Dale Carnegie'
      },
      {
        TenSach: 'Nhà Giả Kim',
        ISBN: '978-604-2-01234-5',
        DonGia: 79000,
        SoQuyen: 30,
        NamXuatBan: 2019,
        MaNXB: nhaXuatBan[0]._id,
        NguonGoc_TacGia: 'Paulo Coelho'
      },
      {
        TenSach: 'Sapiens: Lược Sử Loài Người',
        ISBN: '978-604-2-23456-7',
        DonGia: 189000,
        SoQuyen: 15,
        NamXuatBan: 2021,
        MaNXB: nhaXuatBan[0]._id,
        NguonGoc_TacGia: 'Yuval Noah Harari'
      },
      {
        TenSach: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        ISBN: '978-604-2-34567-8',
        DonGia: 120000,
        SoQuyen: 20,
        NamXuatBan: 2018,
        MaNXB: nhaXuatBan[0]._id,
        NguonGoc_TacGia: 'Nguyễn Nhật Ánh'
      },
      {
        TenSach: 'Harry Potter và Hòn Đá Phù Thủy',
        ISBN: '978-604-2-45678-9',
        DonGia: 150000,
        SoQuyen: 35,
        NamXuatBan: 2020,
        MaNXB: nhaXuatBan[1]._id,
        NguonGoc_TacGia: 'J.K. Rowling'
      },
      {
        TenSach: 'Dế Mèn Phiêu Lưu Ký',
        ISBN: '978-604-2-56789-0',
        DonGia: 65000,
        SoQuyen: 40,
        NamXuatBan: 2017,
        MaNXB: nhaXuatBan[1]._id,
        NguonGoc_TacGia: 'Tô Hoài'
      },
      {
        TenSach: 'Lập Trình JavaScript Cơ Bản',
        ISBN: '978-604-3-11111-1',
        DonGia: 175000,
        SoQuyen: 18,
        NamXuatBan: 2022,
        MaNXB: nhaXuatBan[3]._id,
        NguonGoc_TacGia: 'Nguyễn Văn A'
      },
      {
        TenSach: 'Toán Cao Cấp A1',
        ISBN: '978-604-3-22222-2',
        DonGia: 95000,
        SoQuyen: 50,
        NamXuatBan: 2023,
        MaNXB: nhaXuatBan[2]._id,
        NguonGoc_TacGia: 'Trần Văn B'
      },
      {
        TenSach: 'Tiếng Anh Giao Tiếp',
        ISBN: '978-604-3-33333-3',
        DonGia: 125000,
        SoQuyen: 0, // Sách hết
        NamXuatBan: 2021,
        MaNXB: nhaXuatBan[2]._id,
        NguonGoc_TacGia: 'Lê Thị C'
      },
      {
        TenSach: 'Truyện Kiều',
        ISBN: '978-604-4-44444-4',
        DonGia: 85000,
        SoQuyen: 28,
        NamXuatBan: 2019,
        MaNXB: nhaXuatBan[4]._id,
        NguonGoc_TacGia: 'Nguyễn Du'
      }
    ]);

    console.log(`✅ Đã tạo ${sach.length} sách`);

    // ========== TẠO NHÂN VIÊN ==========
    const hashedPasswordNV = await bcrypt.hash('123456', 10);
    
    const nhanVien = await NhanVien.insertMany([
      {
        HoTenNV: 'Nguyễn Văn Admin',
        Password: hashedPasswordNV,
        Chucvu: 'Admin',
        DiaChi: '123 Đường ABC, Quận 1, TP.HCM',
        SoDienThoai: '0901234567'
      },
      {
        HoTenNV: 'Trần Thị Thủ Thư',
        Password: hashedPasswordNV,
        Chucvu: 'Thủ thư',
        DiaChi: '456 Đường DEF, Quận 3, TP.HCM',
        SoDienThoai: '0912345678'
      },
      {
        HoTenNV: 'Lê Văn Nhân Viên',
        Password: hashedPasswordNV,
        Chucvu: 'Nhân viên',
        DiaChi: '789 Đường GHI, Quận 5, TP.HCM',
        SoDienThoai: '0923456789'
      }
    ]);

    console.log(`✅ Đã tạo ${nhanVien.length} nhân viên`);

    // ========== TẠO ĐỘC GIẢ ==========
    const hashedPasswordDG = await bcrypt.hash('123456', 10);
    
    const docGia = await DocGia.insertMany([
      {
        HoLot: 'Phạm Văn',
        Ten: 'An',
        Email: 'phamvanan@example.com',
        Password: hashedPasswordDG,
        NgaySinh: new Date('1995-05-15'),
        Phai: 'Nam',
        DiaChi: '111 Đường JKL, Quận 10, TP.HCM',
        DienThoai: '0934567890',
        TrangThai: 'Hoạt động'
      },
      {
        HoLot: 'Nguyễn Thị',
        Ten: 'Bình',
        Email: 'nguyenthibinh@example.com',
        Password: hashedPasswordDG,
        NgaySinh: new Date('1998-08-20'),
        Phai: 'Nữ',
        DiaChi: '222 Đường MNO, Quận Tân Bình, TP.HCM',
        DienThoai: '0945678901',
        TrangThai: 'Hoạt động'
      },
      {
        HoLot: 'Trần Văn',
        Ten: 'Cường',
        Email: 'tranvancuong@example.com',
        Password: hashedPasswordDG,
        NgaySinh: new Date('1997-03-10'),
        Phai: 'Nam',
        DiaChi: '333 Đường PQR, Quận Bình Thạnh, TP.HCM',
        DienThoai: '0956789012',
        TrangThai: 'Hoạt động'
      },
      {
        HoLot: 'Lê Thị',
        Ten: 'Dung',
        Email: 'lethidung@example.com',
        Password: hashedPasswordDG,
        NgaySinh: new Date('2000-11-25'),
        Phai: 'Nữ',
        DiaChi: '444 Đường STU, Quận 7, TP.HCM',
        DienThoai: '0967890123',
        TrangThai: 'Hoạt động'
      },
      {
        HoLot: 'Hoàng Văn',
        Ten: 'Em',
        Email: 'hoangvanem@example.com',
        Password: hashedPasswordDG,
        NgaySinh: new Date('1999-07-18'),
        Phai: 'Nam',
        DiaChi: '555 Đường VWX, Quận 2, TP.HCM',
        DienThoai: '0978901234',
        TrangThai: 'Khóa' // Tài khoản bị khóa
      }
    ]);

    console.log(`✅ Đã tạo ${docGia.length} độc giả`);

    // ========== TẠO BẢN GHI MƯỢN SÁCH ==========
    const muonSach = await TheoDoiMuonSach.insertMany([
      {
        MaDocGia: docGia[0]._id,
        MaSach: sach[0]._id,
        NgayMuon: new Date('2024-11-01'),
        NgayHenTra: new Date('2024-12-01'),
        TrangThai: 'Đang mượn'
      },
      {
        MaDocGia: docGia[0]._id,
        MaSach: sach[1]._id,
        NgayMuon: new Date('2024-10-15'),
        NgayTra: new Date('2024-11-10'),
        NgayHenTra: new Date('2024-11-14'),
        TrangThai: 'Đã trả'
      },
      {
        MaDocGia: docGia[1]._id,
        MaSach: sach[2]._id,
        NgayMuon: new Date('2024-11-20'),
        NgayHenTra: new Date('2024-12-20'),
        TrangThai: 'Đang mượn'
      },
      {
        MaDocGia: docGia[1]._id,
        MaSach: sach[4]._id,
        TrangThai: 'Chờ duyệt'
      },
      {
        MaDocGia: docGia[2]._id,
        MaSach: sach[3]._id,
        NgayMuon: new Date('2024-10-01'),
        NgayHenTra: new Date('2024-11-01'),
        TrangThai: 'Quá hạn'
      },
      {
        MaDocGia: docGia[3]._id,
        MaSach: sach[5]._id,
        TrangThai: 'Chờ duyệt'
      },
      {
        MaDocGia: docGia[3]._id,
        MaSach: sach[6]._id,
        NgayMuon: new Date('2024-09-15'),
        NgayTra: new Date('2024-10-10'),
        NgayHenTra: new Date('2024-10-15'),
        TrangThai: 'Đã trả',
        TienPhat: 0
      }
    ]);

    console.log(`✅ Đã tạo ${muonSach.length} bản ghi mượn sách`);

    console.log('\n========================================');
    console.log('✅ SEED DỮ LIỆU THÀNH CÔNG!');
    console.log('========================================\n');

    console.log('📋 THÔNG TIN TÀI KHOẢN MẪU:\n');
    
    console.log('👨‍💼 NHÂN VIÊN:');
    console.log('  Admin:');
    console.log('    - Số điện thoại: 0901234567');
    console.log('    - Mật khẩu: 123456');
    console.log('  Thủ thư:');
    console.log('    - Số điện thoại: 0912345678');
    console.log('    - Mật khẩu: 123456');
    console.log('  Nhân viên:');
    console.log('    - Số điện thoại: 0923456789');
    console.log('    - Mật khẩu: 123456\n');

    console.log('👨‍🎓 ĐỘC GIẢ:');
    console.log('  1. Email: phamvanan@example.com | Mật khẩu: 123456');
    console.log('  2. Email: nguyenthibinh@example.com | Mật khẩu: 123456');
    console.log('  3. Email: tranvancuong@example.com | Mật khẩu: 123456');
    console.log('  4. Email: lethidung@example.com | Mật khẩu: 123456');
    console.log('  5. Email: hoangvanem@example.com | Mật khẩu: 123456 (Tài khoản bị khóa)\n');

    console.log('📚 THỐNG KÊ:');
    console.log(`  - Nhà xuất bản: ${nhaXuatBan.length}`);
    console.log(`  - Sách: ${sach.length}`);
    console.log(`  - Nhân viên: ${nhanVien.length}`);
    console.log(`  - Độc giả: ${docGia.length}`);
    console.log(`  - Bản ghi mượn sách: ${muonSach.length}\n`);

    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  }
};

// Chạy seed
seedData();
