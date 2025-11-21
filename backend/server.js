// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import DB
const { sequelize, syncDatabase } = require('./models');

const app = express();

// === CẤU HÌNH CORS (SỬA LẠI ĐỂ DÙNG CHUNG) ===
// Tạo biến này để đảm bảo app.use và app.options giống hệt nhau
const corsOptions = {
    origin: [
        'https://ocean-mobi-store-12.vercel.app', // Link Vercel chính xác của bạn
        'http://localhost:3000' // Link máy local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Cho phép gửi cookie/token
};

// 1. Áp dụng CORS cho mọi request
app.use(cors(corsOptions));

// 2. Xử lý riêng cho Preflight Request (Quan trọng để fix lỗi của bạn)
// Phải truyền corsOptions vào đây nữa thì nó mới khớp
app.options('*', cors(corsOptions)); 

app.use(express.json());

// Kết nối routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        await syncDatabase(); 
        console.log('Đã kết nối và đồng bộ CSDL thành công!');
    } catch (error) {
        console.error('Không thể kết nối hoặc đồng bộ CSDL:', error);
    }
});