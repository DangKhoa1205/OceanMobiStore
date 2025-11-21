// frontend/src/pages/TrackOrderPage.js
import React, { useState } from 'react';

import axios from 'axios';
// Import CSS của trang OrderSuccess và AdminForm để tái sử dụng
import './OrderSuccessPage.css'; 
import './admin/AdminForm.css';

// Component con để hiển thị kết quả (Tái sử dụng giao diện OrderSuccess)
function OrderDetails({ order }) {
    return (
        <div className="order-summary">
            {/* 1. Mã đơn hàng */}
            <div className="summary-section">
                <div className="section-title">Chi tiết đơn hàng</div>
                <div className="section-content">
                    <p><strong>Mã đơn:</strong> #{order.id}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.ngay_dat_hang).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ</p>
                    <p><strong>Thanh toán:</strong> {order.phuong_thuc_thanh_toan}</p>
                    <p><strong>Trạng thái:</strong> {order.trang_thai}</p>
                </div>
            </div>

            {/* 2. Thông tin khách hàng */}
            <div className="summary-section">
                <div className="section-title">Thông tin khách hàng</div>
                <div className="section-content">
                    <p><strong>Người nhận:</strong> {order.User.ho_ten}</p>
                    <p><strong>Email:</strong> {order.User.email}</p>
                    <p><strong>Giao đến:</strong> {order.dia_chi_giao_hang}</p>
                </div>
            </div>
            
            {/* 3. Tên sản phẩm */}
            <div className="summary-section">
                <div className="section-title">Sản phẩm đã đặt ({order.OrderItems.length})</div>
                <div className="section-content">
                    {order.OrderItems.map(item => (
                        <div key={item.id} className="product-item">
                            <img src={item.Product.hinh_anh_url} alt={item.Product.ten_san_pham} />
                            <div className="product-info">
                                <span>{item.Product.ten_san_pham}</span><br/>
                                <small>Số lượng: {item.so_luong}</small>
                            </div>
                            <div className="product-price">
                                {new Intl.NumberFormat('vi-VN').format(item.gia_luc_mua * item.so_luong)} đ
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// Component chính của trang Tra cứu
function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null); // Lưu kết quả tra cứu
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const { data } = await axios.post('https://ocean-backend-lcpp.onrender.com//api/orders/lookup', {
                orderId: orderId.trim(), // Xóa khoảng trắng
                email: email.trim()
            });
            setOrder(data); // Lưu kết quả
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tra cứu');
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            {/* Hiển thị kết quả nếu đã tra cứu thành công */}
            {order ? (
                <>
                    <h1 className="admin-form-title">Chi tiết Đơn hàng #{order.id}</h1>
                    <OrderDetails order={order} />
                    <button 
                        onClick={() => setOrder(null)} // Nút tra cứu đơn khác
                        className="admin-submit-button" 
                        style={{maxWidth: '300px', margin: '2rem auto', background: '#555'}}
                    >
                        Tra cứu đơn hàng khác
                    </button>
                </>
            ) : (
                /* Hiển thị form tra cứu nếu chưa có kết quả */
                <>
                    <h2 className="admin-form-title">Tra cứu đơn hàng</h2>
                    <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '500px' }}>
                        <p style={{marginBottom: '1rem', color: '#555'}}>
                            Vui lòng nhập Mã đơn hàng (ID) và Email bạn đã dùng khi đặt hàng.
                        </p>
                        <div className="form-group">
                            <label htmlFor="orderId">Mã đơn hàng:</label>
                            <input
                                id="orderId"
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Ví dụ: 12"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email đăng ký:</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ví dụ: email@gmail.com"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="admin-submit-button">
                            {loading ? 'Đang tra cứu...' : 'Tra cứu'}
                        </button>
                        {error && <p className="admin-form-error">{error}</p>}
                    </form>
                </>
            )}
        </div>
    );
}

export default TrackOrderPage;