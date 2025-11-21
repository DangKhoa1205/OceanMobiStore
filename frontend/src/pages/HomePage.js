// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; 
import { useSelector, useDispatch } from 'react-redux'; // <-- 1. IMPORT useDispatch
import './HomePage.css'; 
import ConfirmModal from '../components/ConfirmModal'; 
import { showToast } from '../redux/toastSlice'; // <-- 2. IMPORT TOAST

// (gridStyles... giữ nguyên)
const gridStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(''); // <-- Không cần state này nữa
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch(); // <-- 3. KHỞI TẠO DISPATCH

    // (State cho Modal... giữ nguyên)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('https://ocean-backend-lcpp.onrender.com//api/products'),
                    axios.get('https://ocean-backend-lcpp.onrender.com//api/categories')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setLoading(false);
            } catch (err) {
                // setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                // === 4. THAY THẾ LỖI TẢI TRANG BẰNG TOAST ===
                dispatch(showToast({ message: 'Không thể tải dữ liệu. Vui lòng thử lại sau.', type: 'error' }));
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]); // <-- Thêm dispatch vào dependency array

    // (Hàm deleteHandler (mở modal)... giữ nguyên)
    const deleteHandler = (id) => {
        setProductToDelete(id); 
        setIsModalOpen(true);   
    };

    // Hàm xác nhận xóa (đã nâng cấp)
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            await axios.delete(`https://ocean-backend-lcpp.onrender.com//api/products/${productToDelete}`, config);
            
            setProducts(products.filter(p => p.id !== productToDelete));
            
            // === 5. THAY THẾ ALERT BẰNG TOAST ===
            dispatch(showToast({ message: 'Xóa sản phẩm thành công!', type: 'success' }));

        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi khi xóa sản phẩm';
            // === 6. THAY THẾ ALERT BẰNG TOAST ===
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setIsModalOpen(false);
            setProductToDelete(null);
        }
    };

    // (filteredProducts... giữ nguyên)
    const filteredProducts = products.filter(product => {
        if (selectedCategory === 'all') return true;
        return product.category_id === selectedCategory;
    });

    // (Render (Hiển thị) giữ nguyên)
    if (loading) return <div className="main-container">Đang tải dữ liệu...</div>;
    // if (error) return <div className="main-container" style={{ color: 'red' }}>{error}</div>; // (Không cần nữa)

    return (
        <div className="main-container"> 
            <h1>Danh sách Sản phẩm</h1>

            {/* (Filter container... giữ nguyên) */}
            <div className="filter-container">
                <button
                    className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    Tất cả
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.ten_danh_muc}
                    </button>
                ))}
            </div>

            {/* (Product grid... giữ nguyên) */}
            <div style={gridStyles}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            userInfo={userInfo}
                            deleteHandler={deleteHandler}
                        />
                    ))
                ) : (
                    <p className="no-products-message">
                        Không tìm thấy sản phẩm nào thuộc hãng này.
                    </p>
                )}
            </div>

            {/* (ConfirmModal... giữ nguyên) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận Xóa"
                message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
            />
        </div>
    );
}

export default HomePage;