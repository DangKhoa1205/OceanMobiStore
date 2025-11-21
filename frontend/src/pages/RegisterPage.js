// frontend/src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // <-- Đã import axios
import { userLogin } from '../redux/userSlice';
import { showToast } from '../redux/toastSlice';
import './RegisterPage.css';

function RegisterPage() {
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State hiển thị lỗi
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo } = useSelector((state) => state.user);
    const redirect = location.search ? location.search.split('=')[1] : '/';

    // Nếu đã đăng nhập thì đá về trang chủ
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    // === QUAN TRỌNG: LINK API RENDER ===
    const API_URL = 'https://ocean-backend.onrender.com';

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Gọi API Đăng ký (Sử dụng link Online)
            const { data } = await axios.post(
                `${API_URL}/api/auth/register`, 
                { ho_ten: hoTen, email, password }
            );

            // 2. Đăng ký thành công -> Tự động đăng nhập luôn
            dispatch(userLogin(data));
            dispatch(showToast({ message: 'Đăng ký thành công!', type: 'success' }));
            
            // 3. Chuyển hướng
            navigate(redirect);

        } catch (err) {
            // Xử lý lỗi trả về từ Backend
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : 'Lỗi đăng ký, vui lòng thử lại';
            setError(message);
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-box">
                <h2 className="register-title">Tạo Tài Khoản</h2>
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Họ tên:</label>
                        <input 
                            type="text" 
                            value={hoTen} 
                            onChange={(e) => setHoTen(e.target.value)} 
                            required 
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="register-footer">
                    Bạn đã có tài khoản? <Link to={redirect === '/' ? '/login' : `/login?redirect=${redirect}`}>Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;