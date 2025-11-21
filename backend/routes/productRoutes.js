// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// (Các route GET, POST, PUT, DELETE cũ giữ nguyên)
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

// === THÊM ROUTE MỚI CHO REVIEW ===
// POST /api/products/:id/reviews (Tạo review - Chỉ cần login)
router.post('/:id/reviews', protect, productController.createProductReview);

module.exports = router;