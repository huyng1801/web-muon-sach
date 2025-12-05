const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
  TenNXB: {
    type: String,
    required: [true, 'Tên nhà xuất bản là bắt buộc'],
    trim: true
  },
  DiaChi: {
    type: String,
    required: [true, 'Địa chỉ là bắt buộc'],
    trim: true
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
nhaXuatBanSchema.index({ TenNXB: 1 });

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
