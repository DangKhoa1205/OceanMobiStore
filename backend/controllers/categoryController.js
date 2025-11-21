// backend/controllers/categoryController.js
const Category = require('../models/Category');

// 1. Lấy tất cả danh mục (hãng)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['ten_danh_muc', 'ASC']]
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 2. Tạo danh mục mới (hãng) - (Đây là hàm bị thiếu export)
exports.createCategory = async (req, res) => {
    try {
        const { ten_danh_muc } = req.body;
        if (!ten_danh_muc) {
            return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
        }
        
        const newCategory = await Category.create({ ten_danh_muc });
        res.status(201).json(newCategory);

    } catch (error) {
        // Xử lý lỗi nếu tên đã tồn tại (unique constraint)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Tên danh mục này đã tồn tại' });
        }
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};