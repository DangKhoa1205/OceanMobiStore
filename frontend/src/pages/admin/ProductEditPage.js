// frontend/src/pages/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './AdminForm.css'; // <-- 1. IMPORT CSS MỚI

function ProductEditPage() {
    const { id: productId } = useParams();
    
    // (State của bạn giữ nguyên)
    const [tenSanPham, setTenSanPham] = useState('');
    const [moTa, setMoTa] = useState('');
    const [gia, setGia] = useState(0);
    const [soLuongTon, setSoLuongTon] = useState(0);
    const [hinhAnhUrl, setHinhAnhUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // (useEffect để tải Categories và Product giữ nguyên)
    useEffect(() => {
        // (Code tải categories...)
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('https://ocean-backend.onrender.com/api/categories');
                setCategories(data);
            } catch (err) { /*...*/ }
        };

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`https://ocean-backend.onrender.com/api/products/${productId}`);
                setTenSanPham(data.ten_san_pham);
                setMoTa(data.mo_ta);
                setGia(data.gia);
                setSoLuongTon(data.so_luong_ton);
                setHinhAnhUrl(data.hinh_anh_url);
                setCategoryId(data.category_id);
                setLoading(false);
            } catch (err) {
                setError('Không tìm thấy sản phẩm');
                setLoading(false);
            }
        };
        fetchCategories();
        fetchProductDetails();
    }, [productId]);

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
            const { data } = await axios.put(
                `https://ocean-backend.onrender.com/api/products/${productId}`,
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
            setSuccess(data.message + " (Sẽ quay về trang chủ sau 2s)");
            setLoading(false);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi cập nhật');
            setLoading(false);
        }
    };

    if (loading) return <div className="main-container">Đang tải...</div>;

    return (
        // 2. SỬ DỤNG LAYOUT CHUNG
        <div className="main-container">
            <Link to="/" className="admin-form-back-link">← Quay lại Trang chủ</Link>
            <h2 className="admin-form-title">Sửa Sản Phẩm (ID: {productId})</h2>
            
            {/* 3. ÁP DỤNG CLASSNAME CHO FORM */}
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="tenSanPham">Tên sản phẩm:</label>
                    <input id="tenSanPham" type="text" value={tenSanPham} onChange={(e) => setTenSanPham(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="moTa">Mô tả:</label>
                    <textarea id="moTa" value={moTa || ''} onChange={(e) => setMoTa(e.target.value)} />
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
                    <input id="hinhAnhUrl" type="text" value={hinhAnhUrl || ''} onChange={(e) => setHinhAnhUrl(e.target.value)} />
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
                    {loading ? 'Đang cập nhật...' : 'Cập nhật Sản Phẩm'}
                </button>
                {error && <p className="admin-form-error">{error}</p>}
                {success && <p className="admin-form-success">{success}</p>}
            </form>
        </div>
    );
}

export default ProductEditPage;