// backend/controllers/productController.js

// Import tất cả model từ file index (nơi có associations)
const { Product, Category, Review, User } = require('../models');
const { Op } = require('sequelize'); // Op thì giữ nguyên

// 1. HÀM TẠO SP (CỦA ADMIN)
exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Thêm sản phẩm thành công!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 2. HÀM LẤY TẤT CẢ SP (TRANG CHỦ)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: Category });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. HÀM LẤY SP THEO ID (TRANG CHI TIẾT)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category }, // Lấy thông tin hãng
                { 
                    model: Review,  // Lấy luôn review
                    include: [
                        { model: User, attributes: ['ho_ten'] } // Lấy tên người review
                    ],
                    order: [['createdAt', 'DESC']]
                } 
            ]
        });

        if (product) {
            const reviews = product.Reviews || [];
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            const numReviews = reviews.length;
            const averageRating = numReviews > 0 ? (totalRating / numReviews).toFixed(1) : 0;
            
            res.status(200).json({ ...product.toJSON(), numReviews, averageRating });
        } else {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
    } catch (error) {
        console.error("LỖI KHI LẤY SẢN PHẨM THEO ID:", error); 
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 4. HÀM SỬA SP (CỦA ADMIN)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            const { ten_san_pham, mo_ta, gia, so_luong_ton, hinh_anh_url, category_id } = req.body;
            product.ten_san_pham = ten_san_pham || product.ten_san_pham;
            product.mo_ta = mo_ta || product.mo_ta;
            product.gia = gia || product.gia;
            product.so_luong_ton = so_luong_ton || product.so_luong_ton;
            product.hinh_anh_url = hinh_anh_url || product.hinh_anh_url;
            product.category_id = category_id || product.category_id;

            const updatedProduct = await product.save();
            res.status(200).json({ message: "Cập nhật sản phẩm thành công!", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        console.error("LỖI KHI CẬP NHẬT SẢN PHẨM:", error); 
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 5. HÀM XÓA SP (CỦA ADMIN)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.destroy();
            res.status(200).json({ message: "Xóa sản phẩm thành công!" });
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        console.error("LỖI KHI XÓA SẢN PHẨM:", error); 
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 6. HÀM TÌM KIẾM SP
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.q || ''; 

        if (!keyword) {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
        }

        const products = await Product.findAll({
            where: {
                ten_san_pham: {
                    [Op.like]: `%${keyword}%`
                }
            },
            include: Category
        });

        res.status(200).json(products);

    } catch (error) {
        console.error("LỖI KHI TÌM KIẾM SẢN PHẨM:", error); 
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 7. HÀM TẠO REVIEW
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const alreadyReviewed = await Review.findOne({
            where: {
                product_id: productId,
                user_id: userId
            }
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        const review = await Review.create({
            rating: Number(rating),
            comment: comment,
            product_id: productId,
            user_id: userId
        });

        // === LỖI ĐÃ ĐƯỢC SỬA TẠI ĐÂY (2CI -> 201) ===
        res.status(201).json({ message: 'Đánh giá thành công!', review });

    } catch (error) {
        console.error("LỖI KHI TẠO REVIEW:", error); 
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};