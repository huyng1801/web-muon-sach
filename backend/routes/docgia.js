const express = require('express');
const router = express.Router();
const docgiaController = require('../controllers/docgiaController');
const { protect, isStaff, isAdmin, isReader } = require('../middleware/auth');
const { validateDocGiaRegister, validateLogin, validate } = require('../middleware/validation');

// ========== ROUTES CÔNG KHAI ==========
// Đăng ký và đăng nhập độc giả
router.post('/register', validateDocGiaRegister, validate, docgiaController.register);
router.post('/login', validateLogin, validate, docgiaController.login);

// ========== ROUTES CHO ĐỘC GIẢ ==========
// Quản lý hồ sơ cá nhân
router.get('/profile', protect, isReader, docgiaController.getProfile);
router.put('/profile', protect, isReader, docgiaController.updateProfile);
router.post('/change-password', protect, isReader, docgiaController.changePassword);

// ========== ROUTES CHO NHÂN VIÊN ==========
// Quản lý độc giả (yêu cầu quyền Staff)
router.get('/', protect, isStaff, docgiaController.getAllDocGia);
router.get('/:id', protect, isStaff, docgiaController.getDocGiaById);
router.post('/', protect, isAdmin, validateDocGiaRegister, validate, docgiaController.createDocGia);
router.put('/:id', protect, isStaff, docgiaController.updateDocGia);
router.patch('/:id/status', protect, isAdmin, docgiaController.updateDocGiaStatus);
router.delete('/:id', protect, isAdmin, docgiaController.deleteDocGia);

module.exports = router;
