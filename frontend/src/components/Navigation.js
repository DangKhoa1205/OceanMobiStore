// frontend/src/components/Navigation.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../redux/userSlice';
import { showToast } from '../redux/toastSlice'; 
import './Navigation.css'; 

function Navigation() {
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 
    
    const { cartItems } = useSelector((state) => state.cart); 
    const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0); 
    const { userInfo } = useSelector((state) => state.user);

    // State cho từ khóa tìm kiếm
    const [keyword, setKeyword] = useState('');

    const handleLogout = () => {
        dispatch(userLogout());
        dispatch(showToast({ message: 'Bạn đã đăng xuất thành công.', type: 'success' }));
        navigate('/login');
    };

    // Xử lý tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?q=${keyword}`);
            setKeyword('');
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img 
                    src="/OceanMobiStore-removebg-preview.png" 
                    alt="OceanMobiStore Logo" 
                    className="logo-image" 
                />
                <span className="logo-text">OceanMobiStore</span>
            </Link>

            {/* Thanh tìm kiếm */}
            <form onSubmit={handleSearchSubmit} className="search-bar">
                <input 
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">
                    <i className="fas fa-search"></i>
                </button>
            </form>

            <div className="navbar-links">
                {userInfo ? (
                    // (Nếu đã đăng nhập...)
                    <>
                        {/* === THAY ĐỔI TẠI ĐÂY: BIẾN TÊN THÀNH LINK PROFILE === */}
                        <Link to="/profile" className="profile-link">
                            Chào, {userInfo.ho_ten}
                        </Link>
                        
                        {userInfo.role === 'admin' && (
                            <> 
                                <Link to="/admin/add-product">Thêm SP</Link>
                                <Link to="/admin/categories">Quản lý Hãng</Link>
                                <Link to="/admin/orders">Quản lý Đơn</Link>
                            </>
                        )}
                        
                        <Link to="/track-order">Tra Cứu Đơn</Link>
                        <Link to="/cart" className="cart-link">
                            Giỏ Hàng ({totalItems})
                        </Link>
                        <button onClick={handleLogout} className="logout-button">
                            Đăng Xuất
                        </button>
                    </>
                ) : (
                    // (Nếu chưa đăng nhập...)
                    <>
                        <Link to="/login">Đăng Nhập</Link>
                        <Link to="/register">Đăng Ký</Link>
                        <Link to="/track-order">Tra Cứu Đơn</Link>
                        <Link to="/cart" className="cart-link">
                            Giỏ Hàng ({totalItems})
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navigation;