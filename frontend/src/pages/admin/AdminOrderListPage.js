// frontend/src/pages/admin/AdminOrderListPage.js
import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. IMPORT useCallback
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/toastSlice';
import './AdminOrderListPage.css'; 

function AdminOrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // === 2. BỌC HÀM NÀY TRONG useCallback ===
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            const { data } = await axios.get('https://ocean-backend-lcpp.onrender.com//api/orders', config);
            setOrders(data);
            setLoading(false);
        } catch (err) {
            const message = err.response?.data?.message || 'Không thể tải đơn hàng';
            dispatch(showToast({ message, type: 'error' }));
            setLoading(false);
        }
    }, [dispatch]); // <-- Thêm dispatch làm phụ thuộc cho useCallback

    // 3. Tải đơn hàng khi component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // <-- 4. THÊM fetchOrders VÀO ĐÂY (Giờ đã an toàn)

    // 5. Hàm xử lý thay đổi trạng thái
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            await axios.put(
                `https://ocean-backend-lcpp.onrender.com//api/orders/${orderId}/status`,
                { status: newStatus },
                config
            );

            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, trang_thai: newStatus } : order
            ));
            
            dispatch(showToast({ message: 'Cập nhật trạng thái thành công!', type: 'success' }));
        } catch (err) {
            const message = err.response?.data?.message || 'Cập nhật thất bại';
            dispatch(showToast({ message, type: 'error' }));
            // Tải lại danh sách (vẫn có thể gọi fetchOrders)
            fetchOrders(); 
        }
    };

    if (loading) {
        return <div className="admin-page-container">Đang tải danh sách đơn hàng...</div>;
    }

    return (
        <div className="admin-page-container">
            <h1 className="admin-page-title">Quản lý Đơn hàng</h1>
            
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center'}}>Không có đơn hàng nào.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.User.ho_ten} ({order.User.email})</td>
                                    <td>{new Date(order.ngay_dat_hang).toLocaleDateString('vi-VN')}</td>
                                    <td style={{maxWidth: '250px'}}>{order.dia_chi_giao_hang}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ</td>
                                    <td>
                                        <select
                                            className="status-select"
                                            data-status={order.trang_thai} 
                                            value={order.trang_thai}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrderListPage;