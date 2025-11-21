// backend/models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review'); // <-- 1. IMPORT REVIEW

// (Các quan hệ cũ: User-Order, Order-Product, Product-Category... giữ nguyên)

// Quan hệ User - Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Quan hệ Order - Product (thông qua OrderItem)
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'product_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Quan hệ Product - Category
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// === 2. THÊM QUAN HỆ MỚI CHO REVIEW ===

// User - Review (Một người có nhiều review)
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// Product - Review (Một sản phẩm có nhiều review)
Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// (Phần sync CSDL giữ nguyên)
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to sync database:', error);
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    User,
    Product,
    Category,
    Order,
    OrderItem,
    Review, // <-- 3. EXPORT REVIEW
};