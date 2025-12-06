const express = require('express');
const router = express.Router();
const theodoimuonsachController = require('../controllers/theodoimuonsachController');
const { protect, isStaff, isReader, isAdmin } = require('../middleware/auth');
const { validateMuonSach, validate } = require('../middleware/validation');

// ========== ROUTES CHO ĐỘC GIẢ ==========
// Đăng ký mượn sách và xem lịch sử
router.post('/', protect, isReader, validateMuonSach, validate, theodoimuonsachController.createMuonSach);
router.get('/user/history', protect, theodoimuonsachController.getUserHistory);

// ========== ROUTES CHO NHÂN VIÊN ==========
// Quản lý mượn/trả sách
router.get('/', protect, theodoimuonsachController.getAllTheoDoiMuonSach);
router.get('/:id', protect, theodoimuonsachController.getTheoDoiMuonSachById);
router.put('/:id/approve', protect, isStaff, theodoimuonsachController.approveMuonSach);
router.put('/:id/reject', protect, isStaff, theodoimuonsachController.rejectMuonSach);
router.put('/:id/return', protect, isStaff, theodoimuonsachController.returnSach);
router.put('/update-overdue', protect, isStaff, theodoimuonsachController.updateOverdueStatus);
router.delete('/:id', protect, isAdmin, theodoimuonsachController.deleteTheoDoiMuonSach);

module.exports = router;
