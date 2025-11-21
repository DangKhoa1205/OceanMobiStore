// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // <-- 1. IMPORT FILE CSS MỚI

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('https://ocean-backend.onrender.com/api/auth/register', {
                email,
                password,
                ho_ten: hoTen
            });

            setSuccess(response.data.message + " Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây.");
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng ký');
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-form-box">
                <h2 className="register-title">Tạo Tài Khoản</h2>
                
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="hoTen">Họ tên:</label>
                        <input
                            id="hoTen"
                            type="text"
                            value={hoTen}
                            onChange={(e) => setHoTen(e.target.value)}
                            required
                        />
                    </div>
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

                    {/* Hiển thị lỗi hoặc thành công */}
                    {error && <p className="register-error">{error}</p>}
                    {success && <p className="register-success">{success}</p>}
                    
                    <button type="submit" className="register-button">Đăng ký</button>
                </form>

                {/* Link quay lại Đăng nhập */}
                <div className="register-links">
                    <Link to="/login">Bạn đã có tài khoản? Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;