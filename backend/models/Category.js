const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ten_danh_muc: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;