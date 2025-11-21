// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../redux/toastSlice';
import './ProfilePage.css'; // Import CSS

function ProfilePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        // Nếu chưa đăng nhập, đá về trang login
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchMyOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };

                // Gọi API mới
                const { data } = await axios.get('https://ocean-backend-lcpp.onrender.com//api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                const message = err.response?.data?.message || 'Lỗi khi tải lịch sử đơn hàng';
                dispatch(showToast({ message, type: 'error' }));
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [userInfo, navigate, dispatch]);

    if (!userInfo) {
        return null; // Đang redirect...
    }

    return (
        <div className="main-container profile-page-container">
            {/* Cột trái: Thông tin User */}
            <div className="profile-info-box">
                <h2>Hồ sơ của bạn</h2>
                <div className="profile-info-item">
                    <strong>Họ tên:</strong>
                    <span>{userInfo.ho_ten}</span>
                </div>
                <div className="profile-info-item">
                    <strong>Email:</strong>
                    <span>{userInfo.email}</span>
                </div>
                {/* Bạn có thể thêm SĐT, Địa chỉ nếu đã lưu trong CSDL */}
            </div>

            {/* Cột phải: Lịch sử đơn hàng */}
            <div className="profile-orders-box">
                <h2>Lịch sử Đơn hàng</h2>
                
                {loading && <p>Đang tải đơn hàng...</p>}
                
                {!loading && orders.length === 0 && (
                    <p>Bạn chưa có đơn hàng nào.</p>
                )}

                {orders.map(order => (
                    <div key={order.id} className="order-history-item">
                        {/* Header của đơn hàng */}
                        <div className="order-history-header">
                            <div className="header-info">
                                <strong>Mã ĐH:</strong>
                                <span>#{order.id}</span>
                            </div>
                            <div className="header-info">
                                <strong>Ngày đặt:</strong>
                                <span>{new Date(order.ngay_dat_hang).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="header-info">
                                <strong>Tổng tiền:</strong>
                                <span style={{color: '#d00', fontWeight: 'bold'}}>
                                    {new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ
                                </span>
                            </div>
                            <div className="header-info">
                                <strong>Trạng thái:</strong>
                                <span>{order.trang_thai}</span>
                            </div>
                        </div>

                        {/* Body (danh sách sản phẩm) */}
                        <div className="order-history-body">
                            {order.OrderItems.map(item => (
                                <div key={item.product_id} className="order-product-item">
                                    <img 
                                        src={item.Product.hinh_anh_url} 
                                        alt={item.Product.ten_san_pham}
                                        className="order-product-img"
                                    />
                                    <div className="order-product-info">
                                        <Link to={`/product/${item.Product.id}`}>
                                            {item.Product.ten_san_pham}
                                        </Link>
                                        <p>
                                            {item.so_luong} x {new Intl.NumberFormat('vi-VN').format(item.gia_luc_mua)} đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;