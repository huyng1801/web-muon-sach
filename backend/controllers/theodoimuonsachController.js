const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');
const DocGia = require('../models/DocGia');

// @desc    Lấy danh sách mượn sách
// @route   GET /api/theodoimuonsach
// @access  Private (Staff xem tất cả, DocGia xem của mình)
exports.getAllTheoDoiMuonSach = async (req, res) => {
  try {
    const { page = 1, limit = 10, TrangThai, MaDocGia, MaSach } = req.query;

    const query = {};

    // Nếu là độc giả, chỉ xem lịch sử của mình
    if (req.userType === 'DocGia') {
      query.MaDocGia = req.userId;
    } else {
      // Nhân viên có thể lọc theo độc giả
      if (MaDocGia) {
        query.MaDocGia = MaDocGia;
      }
    }

    // Lọc theo sách
    if (MaSach) {
      query.MaSach = MaSach;
    }

    // Lọc theo trạng thái
    if (TrangThai) {
      query.TrangThai = TrangThai;
    }

    const muonSachList = await TheoDoiMuonSach.find(query)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai')
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ NgayMuon: -1 });

    const count = await TheoDoiMuonSach.countDocuments(query);

    res.status(200).json({
      success: true,
      count: muonSachList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: muonSachList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách mượn sách',
      error: error.message
    });
  }
};

// @desc    Lấy chi tiết một bản ghi mượn sách
// @route   GET /api/theodoimuonsach/:id
// @access  Private
exports.getTheoDoiMuonSachById = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findById(req.params.id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai DiaChi')
      .populate('MaNhanVien', 'HoTenNV ChucVu')
      .populate({
        path: 'MaSach',
        populate: {
          path: 'MaNXB',
          select: 'TenNXB'
        }
      });

    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi mượn sách'
      });
    }

    // Nếu là độc giả, chỉ được xem của mình
    if (req.userType === 'DocGia' && muonSach.MaDocGia._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thông tin này'
      });
    }

    res.status(200).json({
      success: true,
      data: muonSach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin mượn sách',
      error: error.message
    });
  }
};

// @desc    Đăng ký mượn sách (DocGia)
// @route   POST /api/theodoimuonsach
// @access  Private (DocGia)
exports.createMuonSach = async (req, res) => {
  try {
    const { MaSach } = req.body;
    const MaDocGia = req.userId;

    // Kiểm tra sách tồn tại và còn quyển
    const sach = await Sach.findById(MaSach);
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    if (sach.SoQuyen <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã hết, không thể mượn'
      });
    }

    // Kiểm tra độc giả có đang mượn sách này không
    const dangMuon = await TheoDoiMuonSach.findOne({
      MaDocGia,
      MaSach,
      TrangThai: { $in: ['Chờ duyệt', 'Đang mượn'] }
    });

    if (dangMuon) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đang có yêu cầu mượn hoặc đang mượn sách này'
      });
    }

    // Kiểm tra độc giả có sách quá hạn không
    const quaHan = await TheoDoiMuonSach.findOne({
      MaDocGia,
      TrangThai: 'Quá hạn'
    });

    if (quaHan) {
      return res.status(400).json({
        success: false,
        message: 'Bạn có sách quá hạn chưa trả, vui lòng liên hệ thư viện'
      });
    }

    // Tạo yêu cầu mượn sách (trạng thái Chờ duyệt)
    const muonSach = await TheoDoiMuonSach.create({
      MaDocGia,
      MaSach,
      TrangThai: 'Chờ duyệt'
    });

    const muonSachPopulated = await TheoDoiMuonSach.findById(muonSach._id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai')
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia');

    res.status(201).json({
      success: true,
      message: 'Đăng ký mượn sách thành công, vui lòng chờ nhân viên duyệt',
      data: muonSachPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký mượn sách',
      error: error.message
    });
  }
};

// @desc    Lấy lịch sử mượn sách của bản thân (DocGia) hoặc của 1 DocGia cụ thể (Staff)
// @route   GET /api/theodoimuonsach/user/history
// @access  Private (DocGia hoặc Staff)
exports.getUserHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Nếu là DocGia, lấy lịch sử của chính mình, nếu là Staff, lấy lịch sử của tất cả hoặc của 1 user cụ thể
    const docgiaId = req.userType === 'DocGia' ? req.userId : (req.query.MaDocGia || null);

    if (!docgiaId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID độc giả'
      });
    }

    const muonSachList = await TheoDoiMuonSach.find({ MaDocGia: docgiaId })
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia DonGia')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ NgayMuon: -1 });

    const count = await TheoDoiMuonSach.countDocuments({ MaDocGia: docgiaId });

    res.status(200).json({
      success: true,
      count: muonSachList.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: muonSachList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch sử mượn sách',
      error: error.message
    });
  }
};

// @desc    Duyệt yêu cầu mượn sách (Staff)
// @route   PUT /api/theodoimuonsach/:id/approve
// @access  Private (Staff)
exports.approveMuonSach = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findById(req.params.id);

    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi mượn sách'
      });
    }

    if (muonSach.TrangThai !== 'Chờ duyệt') {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu này đã được xử lý'
      });
    }

    // Kiểm tra sách còn quyển không
    const sach = await Sach.findById(muonSach.MaSach);
    if (!sach || sach.SoQuyen <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã hết, không thể duyệt'
      });
    }

    // Giảm số quyển sách
    sach.SoQuyen -= 1;
    await sach.save();

    // Cập nhật trạng thái
    muonSach.TrangThai = 'Đang mượn';
    muonSach.NgayMuon = new Date();
    muonSach.MaNhanVien = req.userId; // Lưu nhân viên duyệt
    await muonSach.save();

    const muonSachPopulated = await TheoDoiMuonSach.findById(muonSach._id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai')
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia')
      .populate('MaNhanVien', 'HoTenNV ChucVu');

    res.status(200).json({
      success: true,
      message: 'Duyệt mượn sách thành công',
      data: muonSachPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi duyệt mượn sách',
      error: error.message
    });
  }
};

// @desc    Từ chối yêu cầu mượn sách (Staff)
// @route   PUT /api/theodoimuonsach/:id/reject
// @access  Private (Staff)
exports.rejectMuonSach = async (req, res) => {
  try {
    const { GhiChu } = req.body;

    const muonSach = await TheoDoiMuonSach.findById(req.params.id);

    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi mượn sách'
      });
    }

    if (muonSach.TrangThai !== 'Chờ duyệt') {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu này đã được xử lý'
      });
    }

    muonSach.TrangThai = 'Từ chối';
    if (GhiChu) {
      muonSach.GhiChu = GhiChu;
    }
    await muonSach.save();

    const muonSachPopulated = await TheoDoiMuonSach.findById(muonSach._id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai')
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia');

    res.status(200).json({
      success: true,
      message: 'Đã từ chối yêu cầu mượn sách',
      data: muonSachPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi từ chối mượn sách',
      error: error.message
    });
  }
};

// @desc    Ghi nhận trả sách (Staff)
// @route   PUT /api/theodoimuonsach/:id/return
// @access  Private (Staff)
exports.returnSach = async (req, res) => {
  try {
    const { NgayTra, TinhTrangSach, TienPhat, GhiChu } = req.body;
    
    const muonSach = await TheoDoiMuonSach.findById(req.params.id);

    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi mượn sách'
      });
    }

    if (muonSach.TrangThai !== 'Đang mượn' && muonSach.TrangThai !== 'Quá hạn') {
      return res.status(400).json({
        success: false,
        message: 'Sách này không ở trạng thái đang mượn'
      });
    }

    // Tăng số quyển sách
    const sach = await Sach.findById(muonSach.MaSach);
    if (sach) {
      sach.SoQuyen += 1;
      await sach.save();
    }

    // Cập nhật thông tin trả sách
    muonSach.NgayTra = NgayTra ? new Date(NgayTra) : new Date();
    muonSach.TinhTrangSach = TinhTrangSach || 'good';
    muonSach.MaNhanVien = req.userId; // Lưu nhân viên xử lý
    
    // Cập nhật hoặc thêm ghi chú
    if (GhiChu) {
      muonSach.GhiChu = muonSach.GhiChu ? `${muonSach.GhiChu}\n[Trả sách]: ${GhiChu}` : GhiChu;
    }
    
    // Tính tiền phạt nếu quá hạn
    const ngayTra = new Date(muonSach.NgayTra);
    const ngayHenTra = new Date(muonSach.NgayHenTra);
    
    if (ngayTra > ngayHenTra) {
      const soNgayTre = Math.ceil((ngayTra - ngayHenTra) / (1000 * 60 * 60 * 24));
      const tienPhatMoiNgay = TienPhat ? Math.floor(TienPhat / soNgayTre) : 5000; // Mặc định 5000đ/ngày
      muonSach.TienPhat = TienPhat || (soNgayTre * tienPhatMoiNgay);
    } else {
      muonSach.TienPhat = 0;
    }

    muonSach.TrangThai = 'Đã trả';
    await muonSach.save();

    const muonSachPopulated = await TheoDoiMuonSach.findById(muonSach._id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai')
      .populate('MaSach', 'TenSach ISBN NguonGoc_TacGia')
      .populate('MaNhanVien', 'HoTenNV');

    res.status(200).json({
      success: true,
      message: 'Ghi nhận trả sách thành công',
      data: muonSachPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi ghi nhận trả sách',
      error: error.message
    });
  }
};

// @desc    Xóa bản ghi mượn sách (Admin)
// @route   DELETE /api/theodoimuonsach/:id
// @access  Private (Admin)
exports.deleteTheoDoiMuonSach = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);

    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi mượn sách'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa bản ghi mượn sách thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa bản ghi',
      error: error.message
    });
  }
};

// @desc    Cập nhật trạng thái quá hạn tự động
// @route   PUT /api/theodoimuonsach/update-overdue
// @access  Private (Staff)
exports.updateOverdueStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm tất cả sách đang mượn và quá hạn
    const result = await TheoDoiMuonSach.updateMany(
      {
        TrangThai: 'Đang mượn',
        NgayHenTra: { $lt: today }
      },
      {
        TrangThai: 'Quá hạn'
      }
    );

    res.status(200).json({
      success: true,
      message: `Đã cập nhật ${result.modifiedCount} bản ghi sang trạng thái quá hạn`,
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái quá hạn',
      error: error.message
    });
  }
};
