// frontend/src/pages/admin/AdminOrderListPage.js
import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. Thêm useCallback
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../redux/toastSlice';
import './AdminOrderListPage.css'; 

function AdminOrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    // === 2. DÙNG useCallback ĐỂ TỐI ƯU HÓA HÀM NÀY ===
    // Giúp React nhớ hàm này, không tạo lại mỗi lần render
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            dispatch(showToast({ message: 'Lỗi khi tải danh sách đơn hàng', type: 'error' }));
            setLoading(false);
        }
    }, [dispatch, API_URL]); // Hàm này phụ thuộc vào dispatch và API_URL

    // === 3. THÊM fetchOrders VÀO DANH SÁCH PHỤ THUỘC CỦA useEffect ===
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate, fetchOrders]); // <-- Đã thêm fetchOrders vào đây

    // Hàm cập nhật trạng thái giao hàng
    const markAsDelivered = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`${API_URL}/api/orders/${id}/deliver`, {}, config);
            
            dispatch(showToast({ message: 'Đã cập nhật trạng thái đơn hàng', type: 'success' }));
            fetchOrders(); // Tải lại danh sách
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi cập nhật';
            dispatch(showToast({ message: message, type: 'error' }));
        }
    };

    if (loading) return <div className="main-container">Đang tải danh sách đơn hàng...</div>;

    return (
        <div className="main-container">
            <h1>Quản lý Đơn Hàng</h1>
            
            <div className="admin-order-container">
                {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào.</p>
                ) : (
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người dùng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Giao hàng</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.User ? order.User.ho_ten : 'Khách vãng lai'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ</td>
                                    <td>
                                        {order.trang_thai_thanh_toan ? (
                                            <span className="badge-success">Đã thanh toán</span>
                                        ) : (
                                            <span className="badge-warning">Chưa thanh toán</span>
                                        )}
                                    </td>
                                    <td>
                                        {order.trang_thai_giao_hang ? (
                                            <span className="badge-success">Đã giao</span>
                                        ) : (
                                            <button 
                                                className="btn-mark-deliver"
                                                onClick={() => markAsDelivered(order.id)}
                                            >
                                                Đánh dấu đã giao
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order.id}`} className="btn-view">
                                            Xem
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminOrderListPage;