// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// === 1. SỬA LỖI: IMPORT TỪ ./models (tức là file index.js) ===
const { sequelize, syncDatabase } = require('./models');

const app = express();
app.use(cors({
    // Cho phép tên miền Vercel của bạn gọi vào
    origin: '*', // Dấu * nghĩa là cho phép tất cả (dễ nhất để fix lỗi ngay)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các hành động được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các tiêu đề được phép
    credentials: true
})); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc body dạng JSON

// Kết nối routes (Giữ nguyên)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        
        // === 2. SỬA LỖI: GỌI HÀM syncDatabase() TỪ index.js ===
        // Hàm này sẽ tạo bảng VÀ chạy các mối quan hệ (associations)
        await syncDatabase(); 
        
        // (Log cũ của bạn là 'Đã kết nối PostgreSQL thành công!' 
        // nhưng hàm syncDatabase đã log 'Database synced successfully.' rồi,
        // nên chúng ta có thể bỏ log này hoặc giữ lại)
        console.log('Đã kết nối và đồng bộ CSDL thành công!');

    } catch (error) {
        console.error('Không thể kết nối hoặc đồng bộ CSDL:', error);
    }
});