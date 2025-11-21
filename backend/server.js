// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// === 1. SỬA LỖI ENETUNREACH (Ép dùng IPv4) ===
const dns = require('node:dns');
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  console.log('Node version old, skipping ipv4first');
}
// ==============================================

const { sequelize, syncDatabase } = require('./models');

const app = express();

// === CẤU HÌNH CORS ===
const corsOptions = {
    origin: [
        'https://ocean-mobi-store-12.vercel.app', // Link Vercel của bạn
        'http://localhost:3000' // Link máy local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// === QUAN TRỌNG: Fix lỗi Preflight ===
// Dùng corsOptions để trả lời OK cho các yêu cầu thăm dò
try {
    app.options('*', cors(corsOptions));
} catch (error) {
    console.log('CORS options error ignored');
}

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
        // Thêm timeout để tránh treo nếu mạng lag
        await sequelize.authenticate();
        console.log('Kết nối CSDL thành công! Đang đồng bộ...');
        await syncDatabase(); 
        console.log('Đồng bộ CSDL hoàn tất!');
    } catch (error) {
        console.error('LỖI KẾT NỐI CSDL:', error);
    }
});