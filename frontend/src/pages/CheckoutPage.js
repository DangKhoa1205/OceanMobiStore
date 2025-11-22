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

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.gia * item.qty, 0);
    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    const totalPrice = itemsPrice + shippingPrice;

    // State form
    const [hoTen, setHoTen] = useState(userInfo ? userInfo.ho_ten : '');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChi, setDiaChi] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); 

    // === 1. KHAI BÁO API URL CHUẨN ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            
            // === 2. GỌI API TẠO ĐƠN (Fix lỗi //) ===
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
            dispatch(clearCart());
            setLoading(false);
            
            if (paymentMethod === 'COD') {
                dispatch(showToast({ message: 'Đặt hàng thành công!', type: 'success' }));
                navigate(`/order/${newOrder.id}`);
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
        return <div className="main-container">Giỏ hàng trống</div>;
    }

    return (
        <div className="checkout-page-container">
            <div className="checkout-form-box">
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    <h2 className="checkout-title">Thông tin giao hàng</h2>
                    <div className="form-group">
                        <label>Họ tên người nhận:</label>
                        <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="tel" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} required placeholder="09xxxxxxxxx" />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ nhận hàng:</label>
                        <textarea rows="4" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} required />
                    </div>
                </form>
            </div>

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
                    {['COD', 'Momo', 'VNPay'].map(method => (
                        <div key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`} onClick={() => setPaymentMethod(method)}>
                            <input type="radio" checked={paymentMethod === method} readOnly />
                            <label>{method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : `Thanh toán qua ${method}`}</label>
                        </div>
                    ))}
                </div>
                
                <button type="submit" form="checkoutForm" disabled={loading} className="checkout-button">
                    {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
            </div>
        </div>
    );
}
export default CheckoutPage;