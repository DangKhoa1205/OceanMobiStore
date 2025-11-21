// frontend/src/pages/admin/AddProductPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // <-- Đã bỏ useSelector vì không dùng đến
import { showToast } from '../../redux/toastSlice'; 
import './AddProductPage.css'; 

function AddProductPage() {
    const [tenSanPham, setTenSanPham] = useState('');
    const [gia, setGia] = useState('');
    const [hinhAnhUrl, setHinhAnhUrl] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuongTon, setSoLuongTon] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Đã xóa dòng userInfo thừa ở đây

    // === 1. KHAI BÁO API URL CHUẨN ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    // Tải danh sách Hãng
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/categories`);
                setCategories(data);
                
                if (data && data.length > 0) {
                    setCategoryId(data[0].id);
                }
            } catch (error) {
                dispatch(showToast({ message: 'Lỗi khi tải danh sách hãng', type: 'error' }));
            }
        };
        fetchCategories();
    }, [dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(
                `${API_URL}/api/products`,
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

            dispatch(showToast({ message: 'Thêm sản phẩm thành công!', type: 'success' }));
            navigate('/'); 
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi khi thêm sản phẩm';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="add-product-form-container">
                <h1>Thêm Sản Phẩm Mới</h1>
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Tên sản phẩm:</label>
                        <input 
                            type="text" 
                            value={tenSanPham} 
                            onChange={(e) => setTenSanPham(e.target.value)} 
                            required 
                            placeholder="Ví dụ: iPhone 15 Pro Max"
                        />
                    </div>

                    <div className="form-group">
                        <label>Giá (VNĐ):</label>
                        <input 
                            type="number" 
                            value={gia} 
                            onChange={(e) => setGia(e.target.value)} 
                            required 
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Link hình ảnh (URL):</label>
                        <input 
                            type="text" 
                            value={hinhAnhUrl} 
                            onChange={(e) => setHinhAnhUrl(e.target.value)} 
                            required 
                            placeholder="https://example.com/anh-san-pham.jpg"
                        />
                        {hinhAnhUrl && (
                            <div className="image-preview">
                                <img src={hinhAnhUrl} alt="Preview" style={{maxHeight: '100px', marginTop: '10px'}} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Hãng sản xuất:</label>
                        <select 
                            value={categoryId} 
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn hãng --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.ten_danh_muc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Số lượng trong kho:</label>
                        <input 
                            type="number" 
                            value={soLuongTon} 
                            onChange={(e) => setSoLuongTon(e.target.value)} 
                            required 
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết:</label>
                        <textarea 
                            rows="5"
                            value={moTa} 
                            onChange={(e) => setMoTa(e.target.value)} 
                            required 
                        ></textarea>
                    </div>

                    <button type="submit" className="add-btn" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Xác nhận Thêm'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProductPage;