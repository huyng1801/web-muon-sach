const { body, validationResult } = require('express-validator');

// Middleware kiểm tra lỗi validation
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

// Validation cho đăng ký độc giả
exports.validateDocGiaRegister = [
  body('HoLot').trim().notEmpty().withMessage('Họ lót là bắt buộc'),
  body('Ten').trim().notEmpty().withMessage('Tên là bắt buộc'),
  body('Email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('Password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('DiaChi').trim().notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('DienThoai').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ')
];

// Validation cho đăng nhập
exports.validateLogin = [
  body('Email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('Password').notEmpty().withMessage('Mật khẩu là bắt buộc')
];

// Validation cho tạo/cập nhật sách
exports.validateSach = [
  body('TenSach').trim().notEmpty().withMessage('Tên sách là bắt buộc'),
  body('DonGia').isNumeric().withMessage('Đơn giá phải là số').isFloat({ min: 0 }).withMessage('Đơn giá phải lớn hơn hoặc bằng 0'),
  body('SoQuyen').isInt({ min: 0 }).withMessage('Số quyển phải là số nguyên không âm'),
  body('MaNXB').notEmpty().withMessage('Nhà xuất bản là bắt buộc')
];

// Validation cho nhà xuất bản
exports.validateNhaXuatBan = [
  body('TenNXB').trim().notEmpty().withMessage('Tên nhà xuất bản là bắt buộc'),
  body('DiaChi').trim().notEmpty().withMessage('Địa chỉ là bắt buộc')
];

// Validation cho đăng ký mượn sách
exports.validateMuonSach = [
  body('MaSach').notEmpty().withMessage('Mã sách là bắt buộc')
];

// Validation cho nhân viên
exports.validateNhanVien = [
  body('HoTenNV').trim().notEmpty().withMessage('Họ tên nhân viên là bắt buộc'),
  body('Password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('Chucvu').isIn(['Admin', 'Thủ thư', 'Nhân viên']).withMessage('Chức vụ không hợp lệ')
];
