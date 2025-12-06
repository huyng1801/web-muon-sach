const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sachController');
const { protect, isStaff } = require('../middleware/auth');
const { validateSach, validate } = require('../middleware/validation');

// ========== ROUTES CÔNG KHAI ==========
// Xem danh sách và chi tiết sách
router.get('/search', sachController.getAllSach); // Search must be before /:id
router.get('/', sachController.getAllSach);
router.get('/:id', sachController.getSachById);

// ========== ROUTES CHO NHÂN VIÊN ==========
// Quản lý sách (yêu cầu quyền Staff)
router.post('/', protect, isStaff, validateSach, validate, sachController.createSach);
router.put('/:id', protect, isStaff, validateSach, validate, sachController.updateSach);
router.delete('/:id', protect, isStaff, sachController.deleteSach);

module.exports = router;
