// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css'; 
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice'; 
import { showToast } from '../redux/toastSlice'; 

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    // === 1. KHAI BÁO API URL CHUẨN ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    // Hàm xử lý đăng nhập thường
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            // === 2. SỬA LỖI: Dùng API_URL + đường dẫn (không còn //) ===
            const { data } = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });
            
            localStorage.setItem('token', data.token);
            dispatch(userLogin(data.user)); 
            dispatch(showToast({ message: 'Đăng nhập thành công!', type: 'success' }));
            
            navigate('/'); 
        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi đăng nhập';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý đăng nhập Google
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;
        setLoading(true);
        try {
            // === 3. SỬA LỖI: Dùng API_URL ở đây nữa ===
            const { data } = await axios.post(`${API_URL}/api/auth/google-login`, {
                googleToken: googleToken,
            });
            
            localStorage.setItem('token', data.token);
            dispatch(userLogin(data.user));
            dispatch(showToast({ message: 'Đăng nhập bằng Google thành công!', type: 'success' }));
            
            navigate('/');
        } catch (err) {
            dispatch(showToast({ message: 'Lỗi đăng nhập bằng Google.', type: 'error' }));
        } finally {
            setLoading(false);
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