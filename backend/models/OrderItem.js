const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: 'id' } },
    product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    so_luong: { type: DataTypes.INTEGER, allowNull: false },
    gia_luc_mua: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
}, {
    tableName: 'orderitems',
    timestamps: false
});

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = OrderItem;