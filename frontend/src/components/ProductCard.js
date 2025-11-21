// frontend/src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

// CSS styling (giữ nguyên)
const cardStyles = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    width: '250px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative' // Cần cho các nút admin
};
// ... (giữ nguyên imageStyles, priceStyles) ...
const imageStyles = {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    borderRadius: '4px',
};
const priceStyles = {
    color: '#d00',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginTop: '8px',
};

// === 1. STYLE CHO CÁC NÚT ADMIN ===
const adminButtonStyles = {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '10px'
};
const editBtn = {
    padding: '5px 10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none'
};
const deleteBtn = {
    padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
};


// === 2. NHẬN PROPS MỚI (userInfo, deleteHandler) ===
function ProductCard({ product, userInfo, deleteHandler }) {
    return (
        <div style={cardStyles}>
            <Link to={`/product/${product.id}`}>
                <img 
                    src={product.hinh_anh_url || 'https://via.placeholder.com/250'} 
                    alt={product.ten_san_pham} 
                    style={imageStyles} 
                />
                <h3>{product.ten_san_pham}</h3>
            </Link>
            <div style={priceStyles}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
            </div>

            {/* === 3. HIỂN THỊ NÚT NẾU LÀ ADMIN === */}
            {userInfo && userInfo.role === 'admin' && (
                <div style={adminButtonStyles}>
                    {/* Nút Sửa */}
                    <Link 
                        to={`/admin/product/${product.id}/edit`} 
                        style={editBtn}
                    >
                        Sửa
                    </Link>
                    
                    {/* Nút Xóa */}
                    <button 
                        style={deleteBtn}
                        onClick={() => deleteHandler(product.id)}
                    >
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductCard;