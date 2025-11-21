// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css'; 
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice'; 
import { showToast } from '../redux/toastSlice'; // <-- Import đã đúng

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [error, setError] = useState(''); // <-- Không cần state lỗi này nữa
    const [loading, setLoading] = useState(false); // <-- Thêm state loading
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    // Hàm xử lý đăng nhập thường
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            const { data } = await axios.post('https://ocean-backend-lcpp.onrender.com//api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', data.token);
            
            dispatch(userLogin(data.user)); 

            // === 1. THAY THẾ ALERT BẰNG TOAST ===
            dispatch(showToast({ message: 'Đăng nhập thành công!', type: 'success' }));
            
            navigate('/'); 
        } catch (err) {
            // === 2. THAY THẾ SETERROR BẰNG TOAST ===
            const message = err.response?.data?.message || 'Lỗi đăng nhập';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    // Hàm xử lý đăng nhập Google
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;
        setLoading(true); // Bắt đầu loading
        try {
            const { data } = await axios.post('https://ocean-backend-lcpp.onrender.com//api/auth/google-login', {
                googleToken: googleToken,
            });
            localStorage.setItem('token', data.token);
            
            dispatch(userLogin(data.user));

            // === 3. THAY THẾ ALERT BẰNG TOAST ===
            dispatch(showToast({ message: 'Đăng nhập bằng Google thành công!', type: 'success' }));
            
            navigate('/');
        } catch (err) {
            // === 4. THAY THẾ SETERROR BẰNG TOAST ===
            dispatch(showToast({ message: 'Lỗi đăng nhập bằng Google.', type: 'error' }));
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-box">
                <h2 className="login-title">Đăng Nhập</h2>

                <div className="google-login-container">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            // === 5. THAY THẾ SETERROR BẰNG TOAST ===
                            dispatch(showToast({ message: 'Đăng nhập Google thất bại.', type: 'error' }));
                        }}
                    />
                </div>

                <div className="divider">hoặc</div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* === 6. KHÔNG CẦN HIỂN THỊ LỖI Ở ĐÂY NỮA === */}
                    {/* {error && <p className="login-error">{error}</p>} */}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="login-links">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                    <span>|</span>
                    <Link to="/register">Tạo tài khoản mới</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;