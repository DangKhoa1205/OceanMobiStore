// backend/models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const User = require('./User'); // <-- 1. XÓA DÒNG NÀY

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false }, // <-- 2. XÓA 'references' Ở ĐÂY
    tong_tien: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    // (Sửa lại: Tên CSDL thường là 'pending', 'shipped', 'delivered')
    trang_thai: { type: DataTypes.STRING, defaultValue: 'Pending' }, 
    dia_chi_giao_hang: { type: DataTypes.TEXT, allowNull: false },
    ngay_dat_hang: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // (Thêm trường paymentMethod mà chúng ta đã dùng)
    phuong_thuc_thanh_toan: { type: DataTypes.STRING, defaultValue: 'COD' }
}, {
    tableName: 'orders',
    timestamps: false // (Bạn có thể đổi thành true nếu muốn)
});

// === 3. XÓA 2 DÒNG QUAN HỆ NÀY (VÌ ĐÃ CÓ TRONG index.js) ===
// User.hasMany(Order, { foreignKey: 'user_id' });
// Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;