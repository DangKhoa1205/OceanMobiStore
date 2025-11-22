// frontend/src/pages/admin/ProductAdminPage.js
import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. Thêm useCallback
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { showToast } from '../../redux/toastSlice';
import './ProductAdminPage.css'; 

function ProductAdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const dispatch = useDispatch();
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    // === 2. DÙNG useCallback ĐỂ TỐI ƯU HÓA HÀM NÀY ===
    // Giúp React "nhớ" hàm này, không tạo lại mỗi lần render, tránh vòng lặp vô tận
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            dispatch(showToast({ message: 'Lỗi tải danh sách sản phẩm', type: 'error' }));
            setLoading(false);
        }
    }, [dispatch, API_URL]); // Hàm này phụ thuộc vào dispatch và API_URL

    // === 3. THÊM fetchProducts VÀO DANH SÁCH PHỤ THUỘC ===
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // <-- Đã thêm fetchProducts vào đây

    // Xóa sản phẩm
    const deleteHandler = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_URL}/api/products/${id}`, config);
                
                dispatch(showToast({ message: 'Đã xóa thành công', type: 'success' }));
                fetchProducts(); 
            } catch (error) {
                dispatch(showToast({ message: 'Lỗi khi xóa', type: 'error' }));
            }
        }
    };

    if (loading) return <div className="main-container">Đang tải...</div>;

    return (
        <div className="main-container">
            <div className="admin-header">
                <h1>Quản lý Sản Phẩm</h1>
                <Link to="/admin/add-product" className="btn-create">+ Thêm Mới</Link>
            </div>
            <div className="admin-product-table-container">
                {products.length === 0 ? (
                    <p>Chưa có sản phẩm nào.</p>
                ) : (
                    <table className="admin-product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Kho</th>
                                <th>Hãng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.ten_san_pham}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(product.gia)} đ</td>
                                    <td>{product.so_luong_ton}</td>
                                    <td>{product.Category ? product.Category.ten_danh_muc : 'N/A'}</td>
                                    <td>
                                        <Link to={`/admin/product/${product.id}/edit`} className="btn-edit">Sửa</Link>
                                        <button className="btn-delete" onClick={() => deleteHandler(product.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
export default ProductAdminPage;