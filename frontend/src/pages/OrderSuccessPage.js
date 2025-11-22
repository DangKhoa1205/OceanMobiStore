// frontend/src/pages/OrderSuccessPage.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderSuccessPage.css'; // Nếu chưa có thì tạo file rỗng cũng được

function OrderSuccessPage() {
    const { id } = useParams(); // Lấy mã đơn hàng từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // === 1. KHAI BÁO API URL CHUẨN ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // === 2. GỌI API LẤY CHI TIẾT ĐƠN (Fix lỗi //) ===
                const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) return <div className="success-container">Đang tải thông tin đơn hàng...</div>;
    
    // Nếu không tìm thấy đơn (hoặc lỗi), vẫn hiện thông báo thành công nhưng không có chi tiết
    if (!order) return (
        <div className="success-container">
            <div className="success-icon">🎉</div>
            <h2>Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng.</p>
            <Link to="/" className="home-btn">Tiếp tục mua sắm</Link>
        </div>
    );

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <h2>Đặt hàng thành công!</h2>
                    <p>Mã đơn hàng: <strong>#{order.id}</strong></p>
                </div>
                
                <div className="order-info">
                    <p><strong>Người nhận:</strong> {order.shippingAddress}</p>
                    <p><strong>Tổng tiền:</strong> <span className="highlight">{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ</span></p>
                    <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
                    <p><strong>Trạng thái:</strong> {order.trang_thai_thanh_toan ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                </div>

                {/* Danh sách sản phẩm trong đơn (nếu có) */}
                {order.OrderItems && order.OrderItems.length > 0 && (
                    <div className="order-items-list">
                        <h3>Sản phẩm đã mua:</h3>
                        <ul>
                            {order.OrderItems.map((item, index) => (
                                <li key={index}>
                                    {item.ten_san_pham} (x{item.so_luong})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="action-buttons">
                    <Link to="/" className="home-btn">Quay về Trang chủ</Link>
                    <Link to="/profile" className="profile-btn">Xem lịch sử đơn hàng</Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccessPage;