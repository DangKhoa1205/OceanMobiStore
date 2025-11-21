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

    // State cho form
    const [hoTen, setHoTen] = useState(userInfo ? userInfo.ho_ten : '');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChi, setDiaChi] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); 

    // === LINK API RENDER ===
    const API_URL = 'https://ocean-backend.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // (Kiểm tra SĐT)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(soDienThoai)) {
            dispatch(showToast({ message: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 0.', type: 'error' }));
            return;
        }

        // (Kiểm tra địa chỉ)
        if (!diaChi) {
            dispatch(showToast({ message: 'Vui lòng nhập địa chỉ nhận hàng.', type: 'error' }));
            return;
        }

        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            // === ĐÃ SỬA: Dùng API Online ===
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

    // (Kiểm tra login, giỏ hàng... giữ nguyên)
    if (!userInfo) { 
        // Redirect logic here if needed, or handle in useEffect
    }
    if (cartItems.length === 0) { 
        // Handle empty cart
    }

    return (
        <div className="checkout-page-container">
            {/* Cột trái: Form thông tin */}
            <div className="checkout-form-box">
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    <h2 className="checkout-title">Thông tin giao hàng</h2>
                    <div className="form-group">
                        <label htmlFor="hoTen">Họ tên người nhận:</label>
                        <input id="hoTen" type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sdt">Số điện thoại:</label>
                        <input 
                            id="sdt" type="tel" value={soDienThoai} 
                            onChange={(e) => setSoDienThoai(e.target.value)} 
                            required pattern="0[0-9]{9}"
                            title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 số."
                            maxLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="diaChi">Địa chỉ nhận hàng:</label>
                        <textarea 
                            id="diaChi" rows="4" value={diaChi} 
                            onChange={(e) => setDiaChi(e.target.value)} 
                            required 
                        />
                    </div>
                </form>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng */}
            <div className="checkout-summary-box">
                <h2 className="checkout-title" style={{marginTop: '0'}}>Tóm tắt đơn hàng</h2>
                <div className="summary-item">
                    <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(itemsPrice)} đ</span>
                </div>
                <div className="summary-item">
                    <span>Phí vận chuyển:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(shippingPrice)} đ</span>
                </div>
                <div className="summary-total">
                    <span>Tổng cộng:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} đ</span>
                </div>

                <div className="payment-method-container">
                    <h3>Phương thức thanh toán</h3>
                    {/* Lựa chọn 1: COD */}
                    <div 
                        className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('COD')}
                    >
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            id="cod" 
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={() => setPaymentMethod('COD')}
                        />
                        <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                    {/* Lựa chọn 2: Momo */}
                    <div 
                        className={`payment-option ${paymentMethod === 'Momo' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('Momo')}
                    >
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            id="momo" 
                            value="Momo"
                            checked={paymentMethod === 'Momo'}
                            onChange={() => setPaymentMethod('Momo')}
                        />
                        <label htmlFor="momo">
                            <img src="/images/momo.webp" alt="Momo" className="payment-logo" />
                            <span>Thanh toán qua Momo</span>
                        </label>
                    </div>
                     {/* Lựa chọn 3: VNPay */}
                     <div 
                        className={`payment-option ${paymentMethod === 'VNPay' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('VNPay')}
                    >
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            id="vnpay" 
                            value="VNPay"
                            checked={paymentMethod === 'VNPay'}
                            onChange={() => setPaymentMethod('VNPay')}
                        />
                        <label htmlFor="vnpay">
                            <img src="/images/vnpay.jpg" alt="VNPay" className="payment-logo" />
                            <span>Thanh toán qua VNPay</span>
                        </label>
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