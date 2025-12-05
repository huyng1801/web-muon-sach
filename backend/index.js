require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Khởi tạo express app
const app = express();

// Kết nối database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // giới hạn 100 requests mỗi 15 phút
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau'
});

app.use('/api/', limiter);

// Routes
app.use('/api/docgia', require('./routes/docgia'));
app.use('/api/sach', require('./routes/sach'));
app.use('/api/nhaxuatban', require('./routes/nhaxuatban'));
app.use('/api/theodoimuonsach', require('./routes/theodoimuonsach'));
app.use('/api/nhanvien', require('./routes/nhanvien'));

// Route test
app.get('/', (req, res) => {
  res.json({
    message: 'API Website Mượn Sách Online',
    version: '1.0.0',
    endpoints: {
      docgia: '/api/docgia',
      sach: '/api/sach',
      nhaxuatban: '/api/nhaxuatban',
      theodoimuonsach: '/api/theodoimuonsach',
      nhanvien: '/api/nhanvien'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy route'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`🌐 Môi trường: ${process.env.NODE_ENV || 'development'}`);
});
