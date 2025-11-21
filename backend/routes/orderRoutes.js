// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/orders (Tạo đơn - User)
router.post('/', protect, orderController.createOrder);

// GET /api/orders (Lấy tất cả đơn - Admin)
router.get('/', protect, admin, orderController.getAllOrders);

// POST /api/orders/lookup (Tra cứu đơn - Public)
router.post('/lookup', orderController.lookupOrder);

// === THÊM ROUTE MỚI NÀY VÀO ĐÂY ===
// GET /api/orders/myorders (Lấy đơn của tôi - User)
router.get('/myorders', protect, orderController.getMyOrders);

// GET /api/orders/:id (Lấy chi tiết đơn - User (chủ đơn) hoặc Admin)
// (Route này phải nằm SAU /myorders)
router.get('/:id', protect, orderController.getOrderById); 

// PUT /api/orders/:id/status (Cập nhật trạng thái - Admin)
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;