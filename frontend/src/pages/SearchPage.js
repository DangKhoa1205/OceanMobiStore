// frontend/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // <-- Tái sử dụng ProductCard
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/toastSlice';
import './SearchPage.css'; // Import CSS mới

function SearchPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    // 1. Hook để đọc URL (ví dụ: ?q=iphone)
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q'); // Lấy từ khóa 'q'

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword) {
                setProducts([]);
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                // 2. Gọi API tìm kiếm
                const { data } = await axios.get(
                    `https://ocean-backend.onrender.com/api/products/search?q=${keyword}`
                );
                setProducts(data);
                setLoading(false);
            } catch (err) {
                const message = err.response?.data?.message || 'Lỗi khi tìm kiếm';
                dispatch(showToast({ message, type: 'error' }));
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [keyword, dispatch]); // 3. Chạy lại mỗi khi 'keyword' thay đổi

    if (loading) {
        return <div className="main-container">Đang tìm kiếm...</div>;
    }

    return (
        <div className="main-container search-page-container">
            <h1 className="search-title">Kết quả tìm kiếm</h1>
            <p className="search-subtitle">
                Tìm thấy <strong>{products.length}</strong> sản phẩm cho từ khóa <strong>"{keyword}"</strong>
            </p>

            {products.length === 0 ? (
                <p className="no-results-message">
                    Không tìm thấy sản phẩm nào phù hợp.
                </p>
            ) : (
                <div className="search-results-grid">
                    {/* Tái sử dụng ProductCard để hiển thị kết quả */}
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;