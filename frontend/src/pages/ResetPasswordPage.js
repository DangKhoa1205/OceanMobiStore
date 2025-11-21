import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }
        try {
            const response = await axios.post(
                `https://ocean-backend-lcpp.onrender.com//api/auth/reset-password/${token}`, 
                { password }
            );
            setMessage(response.data.message + " Sẽ chuyển đến trang đăng nhập...");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Đặt Lại Mật khẩu Mới</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Đặt lại</button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
export default ResetPasswordPage;