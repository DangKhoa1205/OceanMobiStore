// frontend/src/pages/CartPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// Đảm bảo import 2 hàm này chính xác
import { removeFromCart, updateCartQty } from '../redux/cartSlice'; 
import ConfirmModal from '../components/ConfirmModal'; 
import { showToast } from '../redux/toastSlice'; 
import './CartPage.css'; // (Import CSS nếu bạn đã tạo)

function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);

    // Tính tổng tiền
    const total = cartItems.reduce((acc, item) => acc + item.gia * item.qty, 0);

    // State để quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null); // Lưu ID SP cần xóa

    // Hàm mở Modal (Khi nhấn nút "Xóa")
    const handleRemoveClick = (id) => {
        setItemToRemove(id); // Lưu lại ID
        setIsModalOpen(true);   // Mở hộp thoại
    };
    
    // Hàm xác nhận Xóa (Khi nhấn "Xác nhận Xóa" trên modal)
    const handleConfirmRemove = () => {
        if (!itemToRemove) return;

        dispatch(removeFromCart(itemToRemove)); // Gửi action xóa
        
        // Gửi thông báo Toast
        dispatch(showToast({ message: 'Đã xóa sản phẩm khỏi giỏ hàng.', type: 'success' }));
        
        // Đóng modal và reset state
        setIsModalOpen(false);
        setItemToRemove(null);
    };

    // Hàm xử lý cập nhật số lượng
    const handleQtyChange = (id, qty) => {
        const newQty = Number(qty);
        if (newQty < 1) return; // Không cho phép số lượng < 1
        
        // Gửi action cập nhật số lượng
        dispatch(updateCartQty({ id: id, qty: newQty }));
    };

    return (
        <div className="main-container">
            <h1>Giỏ Hàng</h1>
            {cartItems.length === 0 ? (
                // Nếu giỏ hàng trống
                <div style={{ padding: '2rem 0' }}>
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link to="/" style={{ textDecoration: 'underline' }}>Quay lại trang chủ</Link>
                </div>
            ) : (
                // Nếu có sản phẩm
                <div className="cart-page-container">
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.hinh_anh_url} alt={item.ten_san_pham} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h4>
                                        <Link to={`/product/${item.id}`}>{item.ten_san_pham}</Link>
                                    </h4>
                                    <span style={{color: '#777'}}>Số lượng:</span>
                                    {/* Ô nhập số lượng */}
                                    <input 
                                        type="number" 
                                        className="cart-item-qty" 
                                        value={item.qty} 
                                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <span className="cart-item-price">
                                    {new Intl.NumberFormat('vi-VN').format(item.gia * item.qty)} đ
                                </span>
                                
                                {/* Nút Xóa (Gọi hàm mở modal) */}
                                <button 
                                    className="cart-item-remove"
                                    onClick={() => handleRemoveClick(item.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cột phải: Tổng cộng */}
                    <div className="cart-summary">
                        <h2>Tổng cộng</h2>
                        <div className="cart-summary-total">
                            {new Intl.NumberFormat('vi-VN').format(total)} đ
                        </div>
                        <button 
                            className="cart-checkout-button"
                            onClick={() => navigate('/checkout')}
                            disabled={cartItems.length === 0}
                        >
                            Tiến hành Thanh toán
                        </button>
                    </div>
                </div>
            )}

            {/* Thêm Modal vào cuối */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Xác nhận Xóa"
                message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
            />
        </div>
    );
}

export default CartPage;