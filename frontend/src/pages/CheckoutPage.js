// frontend/src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../redux/cartSlice'; 
import './CheckoutPage.css'; 
import { showToast } from '../redux/toastSlice'; 

function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { userInfo } = useSelector((state) => state.user); 

    // Tính toán tiền
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.gia * item.qty, 0);
    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    const totalPrice = itemsPrice + shippingPrice;

    // State Form
    const [hoTen, setHoTen] = useState(userInfo ? userInfo.ho_ten : '');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChi, setDiaChi] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); 

    // === 1. KHAI BÁO API URL CHUẨN (Không có dấu / ở cuối) ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(soDienThoai)) {
            dispatch(showToast({ message: 'Số điện thoại không hợp lệ.', type: 'error' }));
            return;
        }
        if (!diaChi) {
            dispatch(showToast({ message: 'Vui lòng nhập địa chỉ.', type: 'error' }));
            return;
        }

        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            // === 2. GỌI API TẠO ĐƠN (Sửa lỗi dư dấu //) ===
            // Kết quả sẽ là: ...onrender.com/api/orders
            const { data: orderData } = await axios.post(
                `${API_URL}/api/orders`,
                {
                    cartItems: cartItems,
                    shippingAddress: `Họ tên: ${hoTen}, SĐT: ${soDienThoai}, Địa chỉ: ${diaChi}`,
                    totalPrice: totalPrice,
                    paymentMethod: paymentMethod 
                },
                config
            );
            
            const newOrder = orderData.order;
            dispatch(clearCart()); // Xóa giỏ hàng
            setLoading(false);
            
            // Chuyển hướng sau khi đặt thành công
            if (paymentMethod === 'COD') {
                dispatch(showToast({ message: 'Đặt hàng thành công!', type: 'success' }));
                // Chuyển đến trang OrderSuccessPage thay vì OrderPage (vì bạn chỉ có trang này)
                navigate(`/order-success/${newOrder.id}`);
            } else {
                navigate(`/payment-simulation/${newOrder.id}?method=${paymentMethod}`);
            }
            
        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi khi đặt hàng';
            dispatch(showToast({ message: message, type: 'error' }));
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="main-container">Giỏ hàng trống. <span style={{cursor:'pointer', color:'blue'}} onClick={() => navigate('/')}>Mua sắm ngay</span></div>;
    }

    return (
        <div className="checkout-page-container">
            {/* Cột trái: Form */}
            <div className="checkout-form-box">
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    <h2 className="checkout-title">Thông tin giao hàng</h2>
                    <div className="form-group">
                        <label>Họ tên người nhận:</label>
                        <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="tel" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} required placeholder="Ví dụ: 0901234567" />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ nhận hàng:</label>
                        <textarea rows="4" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} required placeholder="Số nhà, tên đường, phường/xã..." />
                    </div>
                </form>
            </div>

            {/* Cột phải: Tóm tắt & Thanh toán */}
            <div className="checkout-summary-box">
                <h2 className="checkout-title" style={{marginTop: '0'}}>Tóm tắt đơn hàng</h2>
                <div className="summary-item">
                    <span>Tổng tiền hàng:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(itemsPrice)} đ</span>
                </div>
                <div className="summary-item">
                    <span>Phí vận chuyển:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(shippingPrice)} đ</span>
                </div>
                <div className="summary-total">
                    <span>Thanh toán:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} đ</span>
                </div>

                <div className="payment-method-container">
                    <h3>Phương thức thanh toán</h3>
                    
                    <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                        <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                        <label>Thanh toán khi nhận hàng (COD)</label>
                    </div>

                    <div className={`payment-option ${paymentMethod === 'Momo' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Momo')}>
                        <input type="radio" checked={paymentMethod === 'Momo'} readOnly />
                        <label>Thanh toán qua Momo</label>
                    </div>

                    <div className={`payment-option ${paymentMethod === 'VNPay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('VNPay')}>
                        <input type="radio" checked={paymentMethod === 'VNPay'} readOnly />
                        <label>Thanh toán qua VNPay</label>
                    </div>
                </div>
                
                <button type="submit" form="checkoutForm" disabled={loading} className="checkout-button">
                    {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
            </div>
        </div>
    );
}
export default CheckoutPage;