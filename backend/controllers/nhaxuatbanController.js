const NhaXuatBan = require('../models/NhaXuatBan');

// @desc    Lấy danh sách nhà xuất bản
// @route   GET /api/nhaxuatban
// @access  Public
exports.getAllNhaXuatBan = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};

    // Tìm kiếm theo tên NXB
    if (search) {
      query.TenNXB = { $regex: search, $options: 'i' };
    }

    const nxbList = await NhaXuatBan.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ TenNXB: 1 });

    const count = await NhaXuatBan.countDocuments(query);

    res.status(200).json({
      success: true,
      count: nxbList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: nxbList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách nhà xuất bản',
      error: error.message
    });
  }
};

// @desc    Lấy thông tin một nhà xuất bản
// @route   GET /api/nhaxuatban/:id
// @access  Public
exports.getNhaXuatBanById = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findById(req.params.id);

    if (!nxb) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }

    res.status(200).json({
      success: true,
      data: nxb
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin nhà xuất bản',
      error: error.message
    });
  }
};

// @desc    Tạo nhà xuất bản mới
// @route   POST /api/nhaxuatban
// @access  Private (Staff)
exports.createNhaXuatBan = async (req, res) => {
  try {
    const { TenNXB, DiaChi } = req.body;

    const nxb = await NhaXuatBan.create({
      TenNXB,
      DiaChi
    });

    res.status(201).json({
      success: true,
      message: 'Tạo nhà xuất bản thành công',
      data: nxb
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo nhà xuất bản',
      error: error.message
    });
  }
};

// @desc    Cập nhật nhà xuất bản
// @route   PUT /api/nhaxuatban/:id
// @access  Private (Staff)
exports.updateNhaXuatBan = async (req, res) => {
  try {
    const { TenNXB, DiaChi } = req.body;

    const nxb = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      { TenNXB, DiaChi },
      { new: true, runValidators: true }
    );

    if (!nxb) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật nhà xuất bản thành công',
      data: nxb
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật nhà xuất bản',
      error: error.message
    });
  }
};

// @desc    Xóa nhà xuất bản
// @route   DELETE /api/nhaxuatban/:id
// @access  Private (Staff)
exports.deleteNhaXuatBan = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findByIdAndDelete(req.params.id);

    if (!nxb) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa nhà xuất bản thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa nhà xuất bản',
      error: error.message
    });
  }
};
