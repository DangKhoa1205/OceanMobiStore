// frontend/src/pages/admin/AddProductPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './AdminForm.css'; // <-- 1. IMPORT CSS MỚI

function AddProductPage() {
    // (State của bạn giữ nguyên)
    const [tenSanPham, setTenSanPham] = useState('');
    const [moTa, setMoTa] = useState('');
    const [gia, setGia] = useState('');
    const [soLuongTon, setSoLuongTon] = useState('');
    const [hinhAnhUrl, setHinhAnhUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
   

    // (useEffect để tải Categories giữ nguyên)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('https://ocean-backend.onrender.com/api/categories');
                setCategories(data);
                if (data.length > 0) {
                    setCategoryId(data[0].id);
                }
            } catch (err) {
                setError('Lỗi khi tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    // (Hàm handleSubmit giữ nguyên)
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
                'https://ocean-backend.onrender.com/api/products',
                { 
                    ten_san_pham: tenSanPham,
                    mo_ta: moTa,
                    gia: Number(gia),
                    so_luong_ton: Number(soLuongTon),
                    hinh_anh_url: hinhAnhUrl,
                    category_id: Number(categoryId)
                },
                config
            );
            setSuccess(data.message + " (Đã xóa form)");
            setLoading(false);
            // Xóa form
            setTenSanPham('');
            setMoTa('');
            setGia('');
            setSoLuongTon('');
            setHinhAnhUrl('');
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thêm sản phẩm');
            setLoading(false);
        }
    };

    return (
        // 2. SỬ DỤNG LAYOUT CHUNG
        <div className="main-container"> 
            <h2 className="admin-form-title">Thêm Sản Phẩm Mới</h2>
            
            {/* 3. ÁP DỤNG CLASSNAME CHO FORM */}
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="tenSanPham">Tên sản phẩm:</label>
                    <input id="tenSanPham" type="text" value={tenSanPham} onChange={(e) => setTenSanPham(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="moTa">Mô tả:</label>
                    <textarea id="moTa" value={moTa} onChange={(e) => setMoTa(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="gia">Giá:</label>
                    <input id="gia" type="number" value={gia} onChange={(e) => setGia(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="soLuongTon">Số lượng tồn:</label>
                    <input id="soLuongTon" type="number" value={soLuongTon} onChange={(e) => setSoLuongTon(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="hinhAnhUrl">Link hình ảnh:</label>
                    <input id="hinhAnhUrl" type="text" value={hinhAnhUrl} onChange={(e) => setHinhAnhUrl(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Hãng:</label>
                    <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.ten_danh_muc}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading} className="admin-submit-button">
                    {loading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                </button>
                {error && <p className="admin-form-error">{error}</p>}
                {success && <p className="admin-form-success">{success}</p>}
            </form>
        </div>
    );
}

export default AddProductPage;