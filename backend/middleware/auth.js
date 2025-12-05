const jwt = require('jsonwebtoken');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');

// Middleware xác thực JWT chung
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để truy cập'
      });
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra loại user (DocGia hoặc NhanVien)
      if (decoded.userType === 'DocGia') {
        req.user = await DocGia.findById(decoded.id).select('-Password');
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Tài khoản không tồn tại'
          });
        }
        if (req.user.TrangThai === 'Khóa') {
          return res.status(401).json({
            success: false,
            message: 'Tài khoản của bạn đã bị khóa'
          });
        }
      } else if (decoded.userType === 'NhanVien') {
        req.user = await NhanVien.findById(decoded.id).select('-Password');
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Tài khoản nhân viên không tồn tại'
          });
        }
      }

      req.userType = decoded.userType;
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    });
  }
};

// Middleware kiểm tra vai trò (chỉ cho nhân viên)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra user type
    if (req.userType !== 'NhanVien') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập chức năng này'
      });
    }

    // Kiểm tra chức vụ
    if (!roles.includes(req.user.Chucvu)) {
      return res.status(403).json({
        success: false,
        message: 'Chức vụ của bạn không có quyền thực hiện hành động này'
      });
    }

    next();
  };
};

// Middleware kiểm tra quyền staff (Admin hoặc Thủ thư)
exports.isStaff = (req, res, next) => {
  if (req.userType !== 'NhanVien') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ nhân viên mới có quyền truy cập'
    });
  }
  next();
};

// Middleware kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
  if (req.userType !== 'NhanVien' || req.user.Chucvu !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Admin mới có quyền truy cập'
    });
  }
  next();
};

// Middleware kiểm tra quyền độc giả
exports.isReader = (req, res, next) => {
  if (req.userType !== 'DocGia') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ độc giả mới có quyền truy cập'
    });
  }
  next();
};
