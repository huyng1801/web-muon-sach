const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DocGia = require('../models/DocGia');

// Tạo JWT token
const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Đăng ký độc giả
// @route   POST /api/docgia/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { HoLot, Ten, Email, Password, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

    // Kiểm tra email đã tồn tại
    const existingEmail = await DocGia.findOne({ Email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await DocGia.findOne({ DienThoai });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Tạo độc giả mới
    const docGia = await DocGia.create({
      HoLot,
      Ten,
      Email,
      Password: hashedPassword,
      NgaySinh,
      Phai,
      DiaChi,
      DienThoai
    });

    // Tạo token
    const token = signToken(docGia._id, 'DocGia');

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      data: {
        _id: docGia._id,
        HoLot: docGia.HoLot,
        Ten: docGia.Ten,
        Email: docGia.Email,
        DiaChi: docGia.DiaChi,
        DienThoai: docGia.DienThoai,
        TrangThai: docGia.TrangThai
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký',
      error: error.message
    });
  }
};

// @desc    Đăng nhập độc giả
// @route   POST /api/docgia/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Kiểm tra độc giả tồn tại
    const docGia = await DocGia.findOne({ Email });
    if (!docGia) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (docGia.TrangThai === 'Khóa') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(Password, docGia.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo token
    const token = signToken(docGia._id, 'DocGia');

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      data: {
        _id: docGia._id,
        HoLot: docGia.HoLot,
        Ten: docGia.Ten,
        Email: docGia.Email,
        DiaChi: docGia.DiaChi,
        DienThoai: docGia.DienThoai,
        TrangThai: docGia.TrangThai,
        userType: 'DocGia'
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

// @desc    Lấy thông tin hồ sơ cá nhân
// @route   GET /api/docgia/profile
// @access  Private (DocGia)
exports.getProfile = async (req, res) => {
  try {
    const docGia = await DocGia.findById(req.userId).select('-Password');
    
    res.status(200).json({
      success: true,
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/docgia/profile
// @access  Private (DocGia)
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['HoLot', 'Ten', 'NgaySinh', 'Phai', 'DiaChi', 'DienThoai'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Kiểm tra số điện thoại trùng (nếu có thay đổi)
    if (updates.DienThoai) {
      const existingPhone = await DocGia.findOne({ 
        DienThoai: updates.DienThoai,
        _id: { $ne: req.userId }
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    const docGia = await DocGia.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-Password');

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật thông tin',
      error: error.message
    });
  }
};

// @desc    Đổi mật khẩu
// @route   POST /api/docgia/change-password
// @access  Private (DocGia)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    const docGia = await DocGia.findById(req.userId);

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, docGia.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    // Mã hóa mật khẩu mới
    docGia.Password = await bcrypt.hash(newPassword, 10);
    await docGia.save();

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

// ========== QUẢN LÝ ĐỘC GIẢ (CHO NHÂN VIÊN) ==========

// @desc    Lấy danh sách độc giả
// @route   GET /api/docgia
// @access  Private (Staff)
exports.getAllDocGia = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, TrangThai } = req.query;

    const query = {};

    // Tìm kiếm theo tên hoặc email
    if (search) {
      query.$or = [
        { HoLot: { $regex: search, $options: 'i' } },
        { Ten: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { DienThoai: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo trạng thái
    if (TrangThai) {
      query.TrangThai = TrangThai;
    }

    const docGiaList = await DocGia.find(query)
      .select('-Password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ NgayDangKy: -1 });

    const count = await DocGia.countDocuments(query);

    res.status(200).json({
      success: true,
      count: docGiaList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: docGiaList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách độc giả',
      error: error.message
    });
  }
};

// @desc    Lấy thông tin một độc giả
// @route   GET /api/docgia/:id
// @access  Private (Staff)
exports.getDocGiaById = async (req, res) => {
  try {
    const docGia = await DocGia.findById(req.params.id).select('-Password');

    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }

    res.status(200).json({
      success: true,
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin độc giả',
      error: error.message
    });
  }
};

// @desc    Tạo độc giả mới (Admin)
// @route   POST /api/docgia
// @access  Private (Admin)
exports.createDocGia = async (req, res) => {
  try {
    const { HoLot, Ten, Email, Password, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

    // Kiểm tra email đã tồn tại
    const existingEmail = await DocGia.findOne({ Email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await DocGia.findOne({ DienThoai });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    const docGia = await DocGia.create({
      HoLot,
      Ten,
      Email,
      Password: hashedPassword,
      NgaySinh,
      Phai,
      DiaChi,
      DienThoai
    });

    res.status(201).json({
      success: true,
      message: 'Tạo độc giả thành công',
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo độc giả',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin độc giả
// @route   PUT /api/docgia/:id
// @access  Private (Staff)
exports.updateDocGia = async (req, res) => {
  try {
    const allowedUpdates = ['HoLot', 'Ten', 'NgaySinh', 'Phai', 'DiaChi', 'DienThoai'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Kiểm tra số điện thoại trùng (nếu có thay đổi)
    if (updates.DienThoai) {
      const existingPhone = await DocGia.findOne({ 
        DienThoai: updates.DienThoai,
        _id: { $ne: req.params.id }
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    const docGia = await DocGia.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-Password');

    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật độc giả thành công',
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật độc giả',
      error: error.message
    });
  }
};

// @desc    Khóa/mở khóa tài khoản độc giả
// @route   PATCH /api/docgia/:id/status
// @access  Private (Admin)
exports.updateDocGiaStatus = async (req, res) => {
  try {
    const { TrangThai } = req.body;

    if (!['Hoạt động', 'Khóa'].includes(TrangThai)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const docGia = await DocGia.findByIdAndUpdate(
      req.params.id,
      { TrangThai },
      { new: true }
    ).select('-Password');

    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }

    res.status(200).json({
      success: true,
      message: `${TrangThai === 'Khóa' ? 'Khóa' : 'Mở khóa'} tài khoản thành công`,
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái',
      error: error.message
    });
  }
};

// @desc    Xóa độc giả
// @route   DELETE /api/docgia/:id
// @access  Private (Admin)
exports.deleteDocGia = async (req, res) => {
  try {
    const docGia = await DocGia.findByIdAndDelete(req.params.id);

    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa độc giả thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa độc giả',
      error: error.message
    });
  }
};
