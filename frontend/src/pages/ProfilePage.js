// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; 
import { showToast } from '../redux/toastSlice';
import { userUpdateProfile } from '../redux/userSlice'; 
import './ProfilePage.css'; 

function ProfilePage() {
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user);

    // === 1. KHAI BÁO API URL CHUẨN (Không có dấu / ở cuối) ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setHoTen(userInfo.ho_ten || '');
            setEmail(userInfo.email || '');
            fetchMyOrders();
        }
    }, [userInfo, navigate]);

    // === 2. LẤY DANH SÁCH ĐƠN HÀNG (Fix lỗi //) ===
    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Gọi API chuẩn:
            const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
            setOrders(data);
            setLoadingOrders(false);
        } catch (error) {
            console.error(error);
            setLoadingOrders(false);
        }
    };

    // === 3. CẬP NHẬT THÔNG TIN (Fix lỗi //) ===
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            dispatch(showToast({ message: 'Mật khẩu xác nhận không khớp', type: 'error' }));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.put(
                `${API_URL}/api/users/profile`,
                { ho_ten: hoTen, password }, 
                config
            );

            dispatch(userUpdateProfile(data));
            dispatch(showToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' }));
            setPassword('');
            setConfirmPassword('');
            
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi cập nhật hồ sơ';
            dispatch(showToast({ message: message, type: 'error' }));
        }
    };

    return (
        <div className="main-container profile-page">
            <div className="profile-container">
                <div className="profile-info-section">
                    <h2>Hồ Sơ Của Tôi</h2>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Họ tên:</label>
                            <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email (Không thể đổi):</label>
                            <input type="email" value={email} disabled className="input-disabled" />
                        </div>
                        <div className="form-group">
                            <label>Đổi Mật khẩu:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu mới..." />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận Mật khẩu:</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu..." />
                        </div>
                        <button type="submit" className="update-btn">Cập nhật</button>
                    </form>
                </div>

                <div className="profile-orders-section">
                    <h2>Đơn Hàng Của Tôi</h2>
                    {loadingOrders ? <p>Đang tải...</p> : orders.length === 0 ? <p>Chưa có đơn hàng.</p> : (
                        <table className="orders-table">
                            <thead>
                                <tr><th>Mã Đơn</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái</th><th>Chi tiết</th></tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ</td>
                                        <td>{order.trang_thai_thanh_toan ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                        <td><button className="btn-sm" onClick={() => navigate(`/order/${order.id}`)}>Xem</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;