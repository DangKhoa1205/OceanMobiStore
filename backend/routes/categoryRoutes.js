// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
// 1. Đảm bảo đã IMPORT controller
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/categories (Lấy tất cả - Public)
router.get('/', categoryController.getAllCategories);

// POST /api/categories (Tạo mới - Admin)
// 2. Đảm bảo DÒNG NÀY (dòng 12) gọi đúng hàm
router.post('/', protect, admin, categoryController.createCategory);

module.exports = router;