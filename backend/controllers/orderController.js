// backend/controllers/orderController.js

// 1. Đảm bảo IMPORT đúng từ models/index.js
const { Order, OrderItem, Product, User } = require('../models');

// 1. TẠO ĐƠN HÀNG MỚI (Đã thêm logic Trừ Kho)
exports.createOrder = async (req, res) => {
    const { cartItems, shippingAddress, totalPrice, paymentMethod } = req.body;
    
    if (cartItems && cartItems.length === 0) {
        return res.status(400).json({ message: 'Không có sản phẩm trong giỏ hàng' });
    }

    try {
        // A. Tạo đơn hàng chính (Order)
        const order = await Order.create({
            user_id: req.user.id,
            tong_tien: totalPrice,
            dia_chi_giao_hang: shippingAddress,
            phuong_thuc_thanh_toan: paymentMethod,
            trang_thai: 'Pending',
            trang_thai_thanh_toan: paymentMethod === 'Momo' || paymentMethod === 'VNPay' ? true : false,
        });

        // B. Tạo chi tiết đơn hàng VÀ Trừ kho
        // Dùng vòng lặp for...of để xử lý tuần tự (an toàn hơn map)
        for (const item of cartItems) {
            // 1. Lưu vào bảng OrderItem
            await OrderItem.create({
                order_id: order.id,
                product_id: item.id,
                so_luong: item.qty,
                gia_luc_mua: item.gia,
            });

            // 2. === QUAN TRỌNG: TRỪ KHO ===
            const product = await Product.findByPk(item.id);
            if (product) {
                // Trừ số lượng tồn kho
                product.so_luong_ton = product.so_luong_ton - item.qty;
                
                // Đảm bảo không bị âm
                if (product.so_luong_ton < 0) product.so_luong_ton = 0;

                // Lưu thay đổi vào Database
                await product.save();
            }
        }
        
        res.status(201).json({ message: 'Tạo đơn hàng thành công', order: order });

    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. LẤY CHI TIẾT ĐƠN
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['ho_ten', 'email'] },
                {
                    model: OrderItem,
                    include: [
                        { model: Product, attributes: ['ten_san_pham', 'hinh_anh_url', 'id'] }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        
        // Bảo mật: Chỉ chủ đơn hàng hoặc admin mới được xem
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
             return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 3. TRA CỨU ĐƠN (PUBLIC)
exports.lookupOrder = async (req, res) => {
    const { orderId, phone } = req.body;
    try {
        const order = await Order.findByPk(orderId, {
             include: [
                { model: User, attributes: ['ho_ten', 'email'] },
                {
                    model: OrderItem,
                    include: [
                        { model: Product, attributes: ['ten_san_pham', 'hinh_anh_url', 'id'] }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        if (!order.dia_chi_giao_hang.includes(phone)) {
            return res.status(404).json({ message: 'Thông tin tra cứu không khớp' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error("Lỗi khi tra cứu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 4. LẤY TẤT CẢ ĐƠN (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                attributes: ['ho_ten', 'email']
            }],
            order: [['createdAt', 'DESC']] // Sửa 'ngay_dat_hang' thành 'createdAt' nếu dùng default timestamp
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Lỗi khi lấy tất cả đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 5. CẬP NHẬT TRẠNG THÁI (ADMIN)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        order.trang_thai = status;
        // Nếu là trạng thái 'Delivered' (Đã giao), có thể cập nhật luôn trang_thai_giao_hang = true
        if (status === 'Delivered') {
            order.trang_thai_giao_hang = true;
        }

        await order.save();
        
        res.status(200).json({ message: 'Cập nhật trạng thái thành công', order });

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 6. LẤY ĐƠN HÀNG CỦA TÔI (USER)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id }, 
            order: [['createdAt', 'DESC']], 
            include: [
                {
                    model: OrderItem,
                    include: [
                        { model: Product, attributes: ['ten_san_pham', 'hinh_anh_url', 'id'] }
                    ]
                }
            ]
        });
        
        res.status(200).json(orders); 

    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng của tôi:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};