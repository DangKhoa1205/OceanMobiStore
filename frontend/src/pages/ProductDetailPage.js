// frontend/src/pages/ProductDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// === ĐÂY LÀ DÒNG QUAN TRỌNG ĐỂ SỬA LỖI AXIOS ===
import axios from 'axios'; 
// ==============================================

import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { showToast } from '../redux/toastSlice';
import './ProductDetailPage.css';
import Rating from '../components/Rating'; 

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    
    const [rating, setRating] = useState(0); 
    const [comment, setComment] = useState(''); 
    const [submitting, setSubmitting] = useState(false); 

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    // Link API (Render)
    const API_URL = 'https://ocean-backend.onrender.com'; 

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/products/${id}`);
            setProduct(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [id]); 

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]); 

    const addToCartHandler = () => {
        const item = { ...product, qty: Number(qty) };
        dispatch(addToCart(item));
        dispatch(showToast({ message: 'Đã thêm vào giỏ hàng!', type: 'success' }));
        navigate('/cart');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            dispatch(showToast({ message: 'Vui lòng chọn số sao đánh giá', type: 'error' }));
            return;
        }
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            await axios.post(
                `${API_URL}/api/products/${id}/reviews`,
                { rating, comment },
                config
            );

            dispatch(showToast({ message: 'Đánh giá của bạn đã được gửi!', type: 'success' }));
            setRating(0);
            setComment('');
            setSubmitting(false);
            
            fetchProduct(); 
            
        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi khi gửi đánh giá';
            dispatch(showToast({ message, type: 'error' }));
            setSubmitting(false);
        }
    };

    if (loading) return <div className="main-container">Đang tải sản phẩm...</div>;
    if (!product) return <div className="main-container">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="main-container">
            <div className="product-detail-container">
                <div className="product-detail-image">
                    <img src={product.hinh_anh_url} alt={product.ten_san_pham} />
                </div>
                <div className="product-detail-info">
                    <h2>{product.ten_san_pham}</h2>
                    <p className="product-detail-category">
                        Hãng: {product.Category ? product.Category.ten_danh_muc : 'Không rõ'}
                    </p>
                    
                    <Rating 
                        value={product.averageRating} 
                        text={`${product.numReviews} đánh giá`} 
                    />
                    
                    <p className="product-detail-price">
                        {new Intl.NumberFormat('vi-VN').format(product.gia)} đ
                    </p>
                    <p className="product-detail-description">
                        {product.mo_ta}
                    </p>
                </div>
                <div className="product-detail-action">
                    <div className="action-group">
                        <span>Giá:</span>
                        <span className="action-price">
                            {new Intl.NumberFormat('vi-VN').format(product.gia)} đ
                        </span>
                    </div>
                    <div className="action-group">
                        <span>Trạng thái:</span>
                        <span>{product.so_luong_ton > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                    </div>
                    <div className="action-group">
                        <span>Số lượng:</span>
                        <input 
                            type="number" 
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, e.target.value))}
                            min="1" 
                            max={product.so_luong_ton}
                        />
                    </div>
                    <button 
                        onClick={addToCartHandler} 
                        className="add-to-cart-btn"
                        disabled={product.so_luong_ton === 0}
                    >
                        {product.so_luong_ton === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>

            <div className="product-reviews-container">
                <div className="product-reviews-list">
                    <h2>Đánh giá ({product.Reviews ? product.Reviews.length : 0})</h2>
                    {(!product.Reviews || product.Reviews.length === 0) ? (
                        <div className="no-reviews-message">Chưa có đánh giá nào.</div>
                    ) : (
                        product.Reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <Rating value={review.rating} text="" />
                                <strong className="review-item-user">{review.User.ho_ten}</strong>
                                <p className="review-item-date">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="review-item-comment">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="product-review-form">
                    <h2>Viết đánh giá của bạn</h2>
                    {userInfo ? (
                        <form onSubmit={handleReviewSubmit}>
                            <div className="review-form-group">
                                <label htmlFor="rating">Xếp hạng:</label>
                                <select 
                                    id="rating" 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value="0">Chọn...</option>
                                    <option value="1">1 - Rất Tệ</option>
                                    <option value="2">2 - Tệ</option>
                                    <option value="3">3 - Ổn</option>
                                    <option value="4">4 - Tốt</option>
                                    <option value="5">5 - Rất Tốt</option>
                                </select>
                            </div>
                            <div className="review-form-group">
                                <label htmlFor="comment">Bình luận (tùy chọn):</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="review-submit-button" 
                                disabled={submitting}
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                            </button>
                        </form>
                    ) : (
                        <div className="review-login-prompt">
                            Vui lòng <Link to="/login">đăng nhập</Link> để viết đánh giá.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;