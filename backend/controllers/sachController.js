const Sach = require('../models/Sach');
const NhaXuatBan = require('../models/NhaXuatBan');

// @desc    Lấy danh sách sách
// @route   GET /api/sach
// @access  Public
exports.getAllSach = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, MaNXB, minPrice, maxPrice, available } = req.query;

    const query = {};

    // Tìm kiếm theo tên sách, tác giả, ISBN
    if (search) {
      query.$or = [
        { TenSach: { $regex: search, $options: 'i' } },
        { NguonGoc_TacGia: { $regex: search, $options: 'i' } },
        { ISBN: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo nhà xuất bản
    if (MaNXB) {
      query.MaNXB = MaNXB;
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      query.DonGia = {};
      if (minPrice) query.DonGia.$gte = Number(minPrice);
      if (maxPrice) query.DonGia.$lte = Number(maxPrice);
    }

    // Lọc sách còn hàng
    if (available === 'true') {
      query.SoQuyen = { $gt: 0 };
    }

    const sachList = await Sach.find(query)
      .populate('MaNXB', 'TenNXB DiaChi')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ NgayThem: -1 });

    const count = await Sach.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sachList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: sachList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách sách',
      error: error.message
    });
  }
};

// @desc    Lấy thông tin một sách
// @route   GET /api/sach/:id
// @access  Public
exports.getSachById = async (req, res) => {
  try {
    const sach = await Sach.findById(req.params.id).populate('MaNXB', 'TenNXB DiaChi');

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    res.status(200).json({
      success: true,
      data: sach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin sách',
      error: error.message
    });
  }
};

// @desc    Tạo sách mới
// @route   POST /api/sach
// @access  Private (Staff)
exports.createSach = async (req, res) => {
  try {
    const { TenSach, ISBN, DonGia, SoQuyen, NamXuatBan, MaNXB, NguonGoc_TacGia } = req.body;

    // Kiểm tra nhà xuất bản tồn tại
    const nxb = await NhaXuatBan.findById(MaNXB);
    if (!nxb) {
      return res.status(404).json({
        success: false,
        message: 'Nhà xuất bản không tồn tại'
      });
    }

    // Kiểm tra ISBN trùng (nếu có)
    if (ISBN) {
      const existingISBN = await Sach.findOne({ ISBN });
      if (existingISBN) {
        return res.status(400).json({
          success: false,
          message: 'ISBN đã tồn tại'
        });
      }
    }

    const sach = await Sach.create({
      TenSach,
      ISBN,
      DonGia,
      SoQuyen,
      NamXuatBan,
      MaNXB,
      NguonGoc_TacGia
    });

    const sachPopulated = await Sach.findById(sach._id).populate('MaNXB', 'TenNXB DiaChi');

    res.status(201).json({
      success: true,
      message: 'Tạo sách thành công',
      data: sachPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo sách',
      error: error.message
    });
  }
};

// @desc    Cập nhật sách
// @route   PUT /api/sach/:id
// @access  Private (Staff)
exports.updateSach = async (req, res) => {
  try {
    const { TenSach, ISBN, DonGia, SoQuyen, NamXuatBan, MaNXB, NguonGoc_TacGia } = req.body;

    // Kiểm tra nhà xuất bản tồn tại (nếu có thay đổi)
    if (MaNXB) {
      const nxb = await NhaXuatBan.findById(MaNXB);
      if (!nxb) {
        return res.status(404).json({
          success: false,
          message: 'Nhà xuất bản không tồn tại'
        });
      }
    }

    // Kiểm tra ISBN trùng (nếu có thay đổi)
    if (ISBN) {
      const existingISBN = await Sach.findOne({ 
        ISBN,
        _id: { $ne: req.params.id }
      });
      if (existingISBN) {
        return res.status(400).json({
          success: false,
          message: 'ISBN đã tồn tại'
        });
      }
    }

    const sach = await Sach.findByIdAndUpdate(
      req.params.id,
      {
        TenSach,
        ISBN,
        DonGia,
        SoQuyen,
        NamXuatBan,
        MaNXB,
        NguonGoc_TacGia
      },
      { new: true, runValidators: true }
    ).populate('MaNXB', 'TenNXB DiaChi');

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: sach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật sách',
      error: error.message
    });
  }
};

// @desc    Xóa sách
// @route   DELETE /api/sach/:id
// @access  Private (Staff)
exports.deleteSach = async (req, res) => {
  try {
    const sach = await Sach.findByIdAndDelete(req.params.id);

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa sách thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa sách',
      error: error.message
    });
  }
};
