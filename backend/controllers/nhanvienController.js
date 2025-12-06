const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien');

// Tạo JWT token
const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Đăng ký nhân viên (Admin)
// @route   POST /api/nhanvien/register
// @access  Private (Admin)
exports.register = async (req, res) => {
  try {
    const { HoTenNV, Password, Chucvu, DiaChi, SoDienThoai } = req.body;

    // Kiểm tra số điện thoại đã tồn tại (nếu có)
    if (SoDienThoai) {
      const existingPhone = await NhanVien.findOne({ SoDienThoai });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Tạo nhân viên mới
    const nhanVien = await NhanVien.create({
      HoTenNV,
      Password: hashedPassword,
      Chucvu,
      DiaChi,
      SoDienThoai
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản nhân viên thành công',
      data: {
        _id: nhanVien._id,
        HoTenNV: nhanVien.HoTenNV,
        Chucvu: nhanVien.Chucvu,
        DiaChi: nhanVien.DiaChi,
        SoDienThoai: nhanVien.SoDienThoai,
        NgayThamGia: nhanVien.NgayThamGia,
        createdAt: nhanVien.createdAt,
        updatedAt: nhanVien.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo tài khoản nhân viên',
      error: error.message
    });
  }
};

// @desc    Đăng nhập nhân viên
// @route   POST /api/nhanvien/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { SoDienThoai, Password } = req.body;

    if (!SoDienThoai || !Password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp số điện thoại và mật khẩu'
      });
    }

    // Kiểm tra nhân viên tồn tại
    const nhanVien = await NhanVien.findOne({ SoDienThoai });
    if (!nhanVien) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(Password, nhanVien.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Tạo token
    const token = signToken(nhanVien._id, 'NhanVien');

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      data: {
        _id: nhanVien._id,
        HoTenNV: nhanVien.HoTenNV,
        Chucvu: nhanVien.Chucvu,
        DiaChi: nhanVien.DiaChi,
        SoDienThoai: nhanVien.SoDienThoai,
        NgayThamGia: nhanVien.NgayThamGia,
        createdAt: nhanVien.createdAt,
        updatedAt: nhanVien.updatedAt,
        userType: 'NhanVien'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập',
      error: error.message
    });
  }
};

// @desc    Lấy danh sách nhân viên
// @route   GET /api/nhanvien
// @access  Private (Admin)
exports.getAllNhanVien = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, Chucvu } = req.query;

    const query = {};

    // Tìm kiếm theo tên
    if (search) {
      query.HoTenNV = { $regex: search, $options: 'i' };
    }

    // Lọc theo chức vụ
    if (Chucvu) {
      query.Chucvu = Chucvu;
    }

    const nhanVienList = await NhanVien.find(query)
      .select('-Password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ NgayThamGia: -1 });

    const count = await NhanVien.countDocuments(query);

    res.status(200).json({
      success: true,
      count: nhanVienList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: nhanVienList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách nhân viên',
      error: error.message
    });
  }
};

// @desc    Lấy thông tin một nhân viên
// @route   GET /api/nhanvien/:id
// @access  Private (Staff)
exports.getNhanVienById = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findById(req.params.id).select('-Password');

    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.status(200).json({
      success: true,
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin nhân viên',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin nhân viên
// @route   PUT /api/nhanvien/:id
// @access  Private (Admin)
exports.updateNhanVien = async (req, res) => {
  try {
    const { HoTenNV, DiaChi, SoDienThoai, Password, Chucvu } = req.body;

    const updates = {};
    if (HoTenNV) updates.HoTenNV = HoTenNV;
    if (DiaChi) updates.DiaChi = DiaChi;
    if (SoDienThoai) updates.SoDienThoai = SoDienThoai;
    if (Chucvu) updates.Chucvu = Chucvu;

    // Kiểm tra số điện thoại trùng (nếu có thay đổi)
    if (SoDienThoai) {
      const existingPhone = await NhanVien.findOne({ 
        SoDienThoai,
        _id: { $ne: req.params.id }
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    // Nếu có thay đổi mật khẩu (không rỗng)
    if (Password && Password.trim()) {
      if (Password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự'
        });
      }
      updates.Password = await bcrypt.hash(Password, 10);
    }

    const nhanVien = await NhanVien.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-Password');

    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật nhân viên thành công',
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật nhân viên',
      error: error.message
    });
  }
};

// @desc    Thay đổi chức vụ nhân viên
// @route   PATCH /api/nhanvien/:id/role
// @access  Private (Admin)
exports.updateRole = async (req, res) => {
  try {
    const { Chucvu } = req.body;

    if (!['Admin', 'Thủ thư', 'Nhân viên'].includes(Chucvu)) {
      return res.status(400).json({
        success: false,
        message: 'Chức vụ không hợp lệ'
      });
    }

    const nhanVien = await NhanVien.findByIdAndUpdate(
      req.params.id,
      { Chucvu },
      { new: true }
    ).select('-Password');

    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật chức vụ thành công',
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật chức vụ',
      error: error.message
    });
  }
};

// @desc    Xóa nhân viên
// @route   DELETE /api/nhanvien/:id
// @access  Private (Admin)
exports.deleteNhanVien = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);

    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa nhân viên thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa nhân viên',
      error: error.message
    });
  }
};

// @desc    Đăng xuất nhân viên
// @route   POST /api/nhanvien/logout
// @access  Private (Staff)
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng xuất',
      error: error.message
    });
  }
};

// @desc    Lấy profile nhân viên hiện tại
// @route   GET /api/nhanvien/profile
// @access  Private (Staff)
exports.getProfile = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findById(req.user.id).select('-Password');
    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.status(200).json({
      success: true,
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin profile',
      error: error.message
    });
  }
};

// @desc    Cập nhật profile nhân viên hiện tại
// @route   PUT /api/nhanvien/profile
// @access  Private (Staff)
exports.updateProfile = async (req, res) => {
  try {
    const { HoTenNV, SoDienThoai, DiaChi } = req.body;

    const updates = {};
    if (HoTenNV) updates.HoTenNV = HoTenNV;
    if (SoDienThoai) updates.SoDienThoai = SoDienThoai;
    if (DiaChi) updates.DiaChi = DiaChi;

    // Kiểm tra số điện thoại trùng (nếu có thay đổi)
    if (SoDienThoai) {
      const existingPhone = await NhanVien.findOne({
        SoDienThoai,
        _id: { $ne: req.user.id }
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    const nhanVien = await NhanVien.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-Password');

    res.status(200).json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật profile',
      error: error.message
    });
  }
};

// @desc    Đổi mật khẩu nhân viên
// @route   PUT /api/nhanvien/change-password
// @access  Private (Staff)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tất cả các trường bắt buộc'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu xác nhận không khớp'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    const nhanVien = await NhanVien.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, nhanVien.Password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash and update new password
    nhanVien.Password = await bcrypt.hash(newPassword, 10);
    await nhanVien.save();

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đổi mật khẩu',
      error: error.message
    });
  }
};
