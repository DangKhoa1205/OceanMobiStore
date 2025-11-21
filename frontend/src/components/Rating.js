// frontend/src/components/Rating.js
import React from 'react';
import './Rating.css'; // Chúng ta sẽ tạo file CSS này ngay sau

// Component này nhận vào 2 prop: 'value' (số sao) và 'text' (số lượng review)
function Rating({ value, text }) {
    return (
        <div className="rating">
            <span>
                <i className={value >= 1 ? 'fas fa-star' : value >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>
            <span>
                <i className={value >= 2 ? 'fas fa-star' : value >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>
            <span>
                <i className={value >= 3 ? 'fas fa-star' : value >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>
            <span>
                <i className={value >= 4 ? 'fas fa-star' : value >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>
            <span>
                <i className={value >= 5 ? 'fas fa-star' : value >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>
            {/* Hiển thị số lượng review nếu có */}
            <span className="rating-text">{text && `(${text})`}</span>
        </div>
    );
}

export default Rating;