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
        SoDienThoai: nhanVien.SoDienThoai
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
        ChucVu: nhanVien.Chucvu, // Chuyển đổi từ Chucvu sang ChucVu
        DiaChi: nhanVien.DiaChi,
        SoDienThoai: nhanVien.SoDienThoai,
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
    const { HoTenNV, DiaChi, SoDienThoai, Password } = req.body;

    const updates = {};
    if (HoTenNV) updates.HoTenNV = HoTenNV;
    if (DiaChi) updates.DiaChi = DiaChi;
    if (SoDienThoai) updates.SoDienThoai = SoDienThoai;

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

    // Nếu có thay đổi mật khẩu
    if (Password) {
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
