// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, syncDatabase } = require('./models');

const app = express();

const corsOptions = {
    origin: [
        'https://ocean-mobi-store-12.vercel.app', 
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// === ĐÃ SỬA DÒNG NÀY ===
app.options(/.*/, cors(corsOptions)); 
// ======================

app.use(express.json());

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