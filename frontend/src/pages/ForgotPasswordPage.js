// frontend/src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/toastSlice';
import './LoginPage.css'; // Dùng chung CSS với trang Login

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(
                'https://ocean-backend.onrender.com/api/auth/forgot-password', 
                { email }
            );

            dispatch(showToast({ message: data.message, type: 'success' }));
            setEmail(''); 
            
        } catch (err) {
            const message = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-box">
                <h2 className="login-title">Quên Mật Khẩu?</h2>

                <p className="login-helper-text">
                    Đừng lo lắng! Vui lòng nhập email của bạn. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            // === LỖI GÕ PHÍM ĐÃ ĐƯỢC SỬA Ở ĐÂY ===
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Link Reset'}
                    </button>
                </form>

                <div className="login-links" style={{ marginTop: '1.5rem' }}>
                    <Link to="/login">Quay lại Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;