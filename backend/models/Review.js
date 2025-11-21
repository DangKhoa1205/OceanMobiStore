// backend/models/Review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Điểm từ 1
            max: 5, // đến 5
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true, // Cho phép không bình luận, chỉ đánh giá
    },
    // Khóa ngoại sẽ được thêm tự động qua associations (trong index.js)
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = Review;