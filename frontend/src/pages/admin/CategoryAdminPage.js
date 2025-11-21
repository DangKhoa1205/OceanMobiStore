// frontend/src/pages/admin/CategoryAdminPage.js
import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. Thêm useCallback
import axios from 'axios';
import { useDispatch } from 'react-redux'; // <-- 2. Bỏ useSelector vì không dùng userInfo
import { showToast } from '../../redux/toastSlice'; 
import './CategoryAdminPage.css';

function CategoryAdminPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    // Đã xóa dòng userInfo thừa

    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    // === 3. SỬA LỖI: Dùng useCallback để hàm này không bị tạo lại liên tục ===
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            dispatch(showToast({ message: 'Lỗi khi tải danh sách hãng', type: 'error' }));
        }
    }, [dispatch, API_URL]); // Hàm này phụ thuộc vào dispatch và API_URL

    // === 4. SỬA LỖI: Thêm fetchCategories vào mảng phụ thuộc ===
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(
                `${API_URL}/api/categories`,
                { ten_danh_muc: newCategory },
                config
            );

            dispatch(showToast({ message: 'Thêm hãng thành công!', type: 'success' }));
            setNewCategory(''); 
            fetchCategories(); // Tải lại danh sách
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi khi thêm hãng';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hãng này không?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                await axios.delete(`${API_URL}/api/categories/${id}`, config);
                
                dispatch(showToast({ message: 'Đã xóa hãng thành công', type: 'success' }));
                fetchCategories();
            } catch (error) {
                const message = error.response?.data?.message || 'Lỗi khi xóa hãng';
                dispatch(showToast({ message: message, type: 'error' }));
            }
        }
    };

    return (
        <div className="main-container">
            <h1>Quản lý Hãng (Category)</h1>
            
            <div className="admin-category-container">
                <div className="category-form">
                    <h3>Thêm Hãng Mới</h3>
                    <form onSubmit={submitHandler}>
                        <input 
                            type="text" 
                            placeholder="Nhập tên hãng (Ví dụ: Samsung)" 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="category-input"
                        />
                        <button type="submit" className="add-btn" disabled={loading}>
                            {loading ? 'Đang thêm...' : 'Thêm Hãng'}
                        </button>
                    </form>
                </div>

                <div className="category-list">
                    <h3>Các Hãng Hiện Có</h3>
                    {categories.length === 0 ? (
                        <p>Chưa có hãng nào.</p>
                    ) : (
                        <table className="category-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên Hãng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>{cat.id}</td>
                                        <td>{cat.ten_danh_muc}</td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => deleteHandler(cat.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryAdminPage;