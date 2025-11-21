// backend/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Category = require('./Category'); // <-- 1. XÓA DÒNG NÀY

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ten_san_pham: { type: DataTypes.STRING, allowNull: false },
    mo_ta: { type: DataTypes.TEXT },
    gia: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    so_luong_ton: { type: DataTypes.INTEGER, defaultValue: 0 },
    hinh_anh_url: { type: DataTypes.STRING },
    category_id: { type: DataTypes.INTEGER }
}, {
    tableName: 'products',
    timestamps: false
});

// === 2. XÓA 2 DÒNG QUAN HỆ NÀY (VÌ ĐÃ CÓ TRONG index.js) ===
// Product.belongsTo(Category, { foreignKey: 'category_id' });
// Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = Product;