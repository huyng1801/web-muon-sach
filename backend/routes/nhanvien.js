const express = require('express');
const router = express.Router();
const nhanvienController = require('../controllers/nhanvienController');
const { protect, isAdmin, isStaff } = require('../middleware/auth');
const { validateNhanVien, validate } = require('../middleware/validation');

// ========== ROUTES CÔNG KHAI ==========
// Đăng nhập nhân viên
router.post('/login', nhanvienController.login);

// ========== ROUTES CHO NHÂN VIÊN ==========
// Profile (nhân viên hiện tại)
router.post('/logout', protect, nhanvienController.logout);
router.get('/profile', protect, nhanvienController.getProfile);
router.put('/profile', protect, nhanvienController.updateProfile);
router.put('/change-password', protect, nhanvienController.changePassword);

// ========== ROUTES CHO ADMIN ==========
// Quản lý nhân viên (chỉ Admin)
router.post('/register', protect, isAdmin, validateNhanVien, validate, nhanvienController.register);
router.get('/', protect, isAdmin, nhanvienController.getAllNhanVien);
router.get('/:id', protect, isStaff, nhanvienController.getNhanVienById);
router.put('/:id', protect, isAdmin, nhanvienController.updateNhanVien);
router.patch('/:id/role', protect, isAdmin, nhanvienController.updateRole);
router.delete('/:id', protect, isAdmin, nhanvienController.deleteNhanVien);

module.exports = router;
