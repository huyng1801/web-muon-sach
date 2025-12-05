const express = require('express');
const router = express.Router();
const nhaxuatbanController = require('../controllers/nhaxuatbanController');
const { protect, isStaff } = require('../middleware/auth');
const { validateNhaXuatBan, validate } = require('../middleware/validation');

// ========== ROUTES CÔNG KHAI ==========
// Xem danh sách và chi tiết nhà xuất bản
router.get('/', nhaxuatbanController.getAllNhaXuatBan);
router.get('/:id', nhaxuatbanController.getNhaXuatBanById);

// ========== ROUTES CHO NHÂN VIÊN ==========
// Quản lý nhà xuất bản (yêu cầu quyền Staff)
router.post('/', protect, isStaff, validateNhaXuatBan, validate, nhaxuatbanController.createNhaXuatBan);
router.put('/:id', protect, isStaff, validateNhaXuatBan, validate, nhaxuatbanController.updateNhaXuatBan);
router.delete('/:id', protect, isStaff, nhaxuatbanController.deleteNhaXuatBan);

module.exports = router;
