const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    ho_ten: { type: DataTypes.STRING },
    dia_chi: { type: DataTypes.TEXT },
    so_dien_thoai: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user', allowNull: false }
}, {
    tableName: 'users', // Tên bảng trong PostgreSQL
    timestamps: false // Không tự động thêm createdAt, updatedAt
});

module.exports = User;