// frontend/src/pages/OrderSuccessPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderSuccessPage.css'; // Import CSS

function OrderSuccessPage() {
    const { id: orderId } = useParams(); // Lấy ID đơn hàng từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` }
                };
                
                const { data } = await axios.get(`https://ocean-backend-lcpp.onrender.com//api/orders/${orderId}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div className="main-container">Đang tải thông tin đơn hàng...</div>;
    if (error) return <div className="main-container" style={{ color: 'red' }}>{error}</div>;
    if (!order) return null;

    return (
        <div className="order-success-container">
            <div className="success-header">
                <h1>Đặt Hàng Thành Công!</h1>
                <p>Cảm ơn bạn đã mua sắm tại OceanMobiStore.</p>
            </div>

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
                        {/* Lưu ý: dia_chi_giao_hang đã gộp cả tên, sđt, địa chỉ
                          Nếu bạn muốn hiển thị tên user đăng ký, dùng order.User.ho_ten
                        */}
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

                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <Link to="/" style={{padding: '10px 20px', background: '#0056b3', color: 'white', borderRadius: '5px'}}>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccessPage;