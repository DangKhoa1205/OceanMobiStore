// frontend/src/pages/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { showToast } from '../../redux/toastSlice'; 
import './ProductEditPage.css'; 

function ProductEditPage() {
    const { id } = useParams();
    
    const [tenSanPham, setTenSanPham] = useState('');
    const [gia, setGia] = useState(0);
    const [hinhAnhUrl, setHinhAnhUrl] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuongTon, setSoLuongTon] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // === 1. KHAI BÁO API URL CHUẨN ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // === 2. FIX LỖI // TẠI ĐÂY ===
                const [productRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/products/${id}`), 
                    axios.get(`${API_URL}/api/categories`)      
                ]);

                const product = productRes.data;
                const cats = categoriesRes.data;

                setTenSanPham(product.ten_san_pham);
                setGia(product.gia);
                setHinhAnhUrl(product.hinh_anh_url);
                setMoTa(product.mo_ta);
                setSoLuongTon(product.so_luong_ton);
                setCategoryId(product.category_id || (cats.length > 0 ? cats[0].id : ''));
                setCategories(cats);

            } catch (error) {
                dispatch(showToast({ message: 'Lỗi khi tải dữ liệu', type: 'error' }));
            }
        };

        fetchData();
    }, [id, dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // === 3. FIX LỖI // TẠI ĐÂY ===
            await axios.put(
                `${API_URL}/api/products/${id}`,
                {
                    ten_san_pham: tenSanPham,
                    gia: Number(gia),
                    hinh_anh_url: hinhAnhUrl,
                    mo_ta: moTa,
                    so_luong_ton: Number(soLuongTon),
                    category_id: categoryId
                },
                config
            );

            dispatch(showToast({ message: 'Cập nhật thành công!', type: 'success' }));
            navigate('/'); // Hoặc '/admin/products' nếu bạn có trang đó
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi cập nhật';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="edit-product-container">
                <h1>Sửa Sản Phẩm #{id}</h1>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Tên sản phẩm:</label>
                        <input type="text" value={tenSanPham} onChange={(e) => setTenSanPham(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Giá (VNĐ):</label>
                        <input type="number" value={gia} onChange={(e) => setGia(e.target.value)} required min="0" />
                    </div>
                    <div className="form-group">
                        <label>Link hình ảnh:</label>
                        <input type="text" value={hinhAnhUrl} onChange={(e) => setHinhAnhUrl(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Hãng:</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kho:</label>
                        <input type="number" value={soLuongTon} onChange={(e) => setSoLuongTon(e.target.value)} required min="0" />
                    </div>
                    <div className="form-group">
                        <label>Mô tả:</label>
                        <textarea rows="5" value={moTa} onChange={(e) => setMoTa(e.target.value)} required></textarea>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Quay lại</button>
                        <button type="submit" className="update-btn" disabled={loading}>{loading ? 'Đang lưu...' : 'Cập nhật'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEditPage;