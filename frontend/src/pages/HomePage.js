// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; 
import { useSelector, useDispatch } from 'react-redux';
import './HomePage.css'; 
import ConfirmModal from '../components/ConfirmModal'; 
import { showToast } from '../redux/toastSlice';

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
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // === 1. KHAI BÁO API URL CHUẨN (Không có dấu / ở cuối) ===
    const API_URL = 'https://ocean-backend-lcpp.onrender.com';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // === 2. SỬA LỖI: Dùng biến API_URL để tránh dư dấu // ===
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/products`),
                    axios.get(`${API_URL}/api/categories`)
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setLoading(false);
            } catch (err) {
                dispatch(showToast({ message: 'Không thể tải dữ liệu. Vui lòng thử lại sau.', type: 'error' }));
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const deleteHandler = (id) => {
        setProductToDelete(id); 
        setIsModalOpen(true);   
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            // === 3. SỬA LỖI: Dùng biến API_URL ở đây nữa ===
            await axios.delete(`${API_URL}/api/products/${productToDelete}`, config);
            
            setProducts(products.filter(p => p.id !== productToDelete));
            
            dispatch(showToast({ message: 'Xóa sản phẩm thành công!', type: 'success' }));

        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi khi xóa sản phẩm';
            dispatch(showToast({ message: message, type: 'error' }));
        } finally {
            setIsModalOpen(false);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(product => {
        if (selectedCategory === 'all') return true;
        return product.category_id === selectedCategory;
    });

    if (loading) return <div className="main-container">Đang tải dữ liệu...</div>;

    return (
        <div className="main-container"> 
            <h1>Danh sách Sản phẩm</h1>

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