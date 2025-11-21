// frontend/src/pages/admin/CategoryAdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import CSS của form admin để dùng chung
import './AdminForm.css'; 

// CSS riêng cho danh sách
const listStyles = {
    listStyle: 'none',
    padding: 0,
    marginTop: '2rem'
};
const listItemStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '0.5rem'
};

function CategoryAdminPage() {
    const [categories, setCategories] = useState([]); // Danh sách hãng
    const [newName, setNewName] = useState(''); // Tên hãng mới
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Hàm tải danh sách các hãng đã có
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://ocean-backend.onrender.com/api/categories');
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tải danh sách hãng');
            setLoading(false);
        }
    };

    // Chạy hàm tải khi component render
    useEffect(() => {
        fetchCategories();
    }, []);

    // Hàm xử lý khi nhấn nút "Thêm"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const { data } = await axios.post(
                'https://ocean-backend.onrender.com/api/categories',
                { ten_danh_muc: newName },
                config
            );

            setSuccess(data.message);
            setLoading(false);
            setNewName(''); // Xóa ô input
            fetchCategories(); // Tải lại danh sách hãng

        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thêm hãng');
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <h2 className="admin-form-title">Quản lý Hãng (Category)</h2>
            
            {/* 1. Form Thêm Hãng Mới */}
            <form onSubmit={handleSubmit} className="admin-form" style={{maxWidth: '500px'}}>
                <div className="form-group">
                    <label htmlFor="newName">Tên hãng mới:</label>
                    <input
                        id="newName"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ví dụ: Xiaomi"
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="admin-submit-button">
                    {loading ? 'Đang thêm...' : 'Thêm Hãng Mới'}
                </button>
                {error && <p className="admin-form-error">{error}</p>}
                {success && <p className="admin-form-success">{success}</p>}
            </form>
            
            {/* 2. Danh sách các hãng đã có */}
            <div className="admin-form" style={{maxWidth: '500px', marginTop: '3rem'}}>
                <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Các Hãng Hiện Có</h3>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <ul style={listStyles}>
                        {categories.map((cat) => (
                            <li key={cat.id} style={listItemStyles}>
                                <span>{cat.ten_danh_muc}</span>
                                <span>(ID: {cat.id})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default CategoryAdminPage;