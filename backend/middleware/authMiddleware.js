// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware 1: Bảo vệ (Check login)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Gắn user vào req (trừ password)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['mat_khau'] }
            });

            if (!req.user) {
                 return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Không có token, từ chối truy cập' });
    }
};

// === 2. THÊM MIDDLEWARE MỚI NÀY ===
// Middleware 2: Check Admin (Phải dùng SAU 'protect')
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Là admin, cho đi tiếp
    } else {
        res.status(403); // 403 = Forbidden (Cấm)
        return res.status(403).json({ message: 'Không có quyền Admin' });
    }
};

module.exports = { protect, admin };