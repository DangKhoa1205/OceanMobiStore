// backend/controllers/orderController.js
const { Order, OrderItem, Product, User } = require('../models');

// 1. TẠO ĐƠN HÀNG MỚI (Phiên bản Debug - Có Log kiểm tra)
exports.createOrder = async (req, res) => {
    console.log("--- BẮT ĐẦU TẠO ĐƠN HÀNG ---"); // Log 1
    const { cartItems, shippingAddress, totalPrice, paymentMethod } = req.body;
    
    // Kiểm tra dữ liệu gửi lên
    console.log("Dữ liệu giỏ hàng nhận được:", JSON.stringify(cartItems)); // Log 2

    if (cartItems && cartItems.length === 0) {
        return res.status(400).json({ message: 'Không có sản phẩm trong giỏ hàng' });
    }

    try {
        // A. Tạo đơn hàng
        const order = await Order.create({
            user_id: req.user.id,
            tong_tien: totalPrice,
            dia_chi_giao_hang: shippingAddress,
            phuong_thuc_thanh_toan: paymentMethod,
            trang_thai: 'Pending',
            trang_thai_thanh_toan: paymentMethod === 'Momo' || paymentMethod === 'VNPay' ? true : false,
        });

        console.log(`Đã tạo đơn hàng ID: ${order.id}`); // Log 3

        // B. Tạo chi tiết & Trừ kho
        for (const item of cartItems) {
            // Lấy số lượng mua (Frontend gửi 'qty', ta đảm bảo chuyển thành Số)
            const qtyToBuy = Number(item.qty); 
            
            // 1. Lưu OrderItem
            await OrderItem.create({
                order_id: order.id,
                product_id: item.id,
                so_luong: qtyToBuy,
                gia_luc_mua: item.gia,
            });

            // 2. === TRỪ KHO (CÓ LOG KIỂM TRA) ===
            const product = await Product.findByPk(item.id);
            
            if (product) {
                console.log(`>> Đang xử lý sản phẩm ID: ${item.id} (${product.ten_san_pham})`);
                console.log(`   - Kho hiện tại: ${product.so_luong_ton}`);
                console.log(`   - Khách mua: ${qtyToBuy}`);

                // Trừ kho
                const newStock = Number(product.so_luong_ton) - qtyToBuy;
                product.so_luong_ton = newStock < 0 ? 0 : newStock;

                await product.save();
                console.log(`   - Kho sau khi trừ: ${product.so_luong_ton}`); // Log quan trọng nhất
            } else {
                console.log(`ERROR: Không tìm thấy sản phẩm ID ${item.id} trong Database!`);
            }
        }
        
        console.log("--- HOÀN TẤT ĐƠN HÀNG ---");
        res.status(201).json({ message: 'Tạo đơn hàng thành công', order: order });

    } catch (error) {
        console.error("LỖI KHI TẠO ĐƠN:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ... (GIỮ NGUYÊN CÁC HÀM KHÁC: getOrderById, lookupOrder, etc.)
// Copy nốt các hàm bên dưới từ file cũ của bạn vào đây nhé
// Hoặc nếu bạn muốn tôi gửi full file thì báo tôi.
// (Để ngắn gọn tôi chỉ gửi hàm bị lỗi logic thôi)