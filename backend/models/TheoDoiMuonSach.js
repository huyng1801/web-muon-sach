const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocGia',
    required: [true, 'Mã độc giả là bắt buộc']
  },
  MaSach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sach',
    required: [true, 'Mã sách là bắt buộc']
  },
  MaNhanVien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NhanVien'
  },
  NgayMuon: {
    type: Date,
    required: true,
    default: Date.now
  },
  NgayTra: {
    type: Date
  },
  NgayHenTra: {
    type: Date,
    required: true,
    default: function() {
      // Mặc định hạn trả sau 30 ngày
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  TrangThai: {
    type: String,
    enum: ['Chờ duyệt', 'Đang mượn', 'Đã trả', 'Quá hạn', 'Từ chối'],
    default: 'Chờ duyệt'
  },
  TinhTrangSach: {
    type: String,
    enum: ['good', 'normal', 'damaged', 'lost'],
    default: 'good'
  },
  TienPhat: {
    type: Number,
    default: 0,
    min: 0
  },
  GhiChu: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
theoDoiMuonSachSchema.index({ MaDocGia: 1, TrangThai: 1 });
theoDoiMuonSachSchema.index({ MaSach: 1, TrangThai: 1 });
theoDoiMuonSachSchema.index({ NgayMuon: 1 });
theoDoiMuonSachSchema.index({ TrangThai: 1 });

// Virtual để kiểm tra quá hạn
theoDoiMuonSachSchema.virtual('isOverdue').get(function() {
  if (this.TrangThai === 'Đang mượn' && this.NgayHenTra) {
    return new Date() > this.NgayHenTra;
  }
  return false;
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
