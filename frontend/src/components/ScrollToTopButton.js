// frontend/src/components/ScrollToTopButton.js
import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css'; // <-- BẠN CÓ THỂ ĐÃ QUÊN DÒNG NÀY

function ScrollToTopButton() {
    // State để theo dõi việc nút có nên hiển thị hay không
    const [isVisible, setIsVisible] = useState(false);

    // 1. Hàm lắng nghe sự kiện cuộn
    const toggleVisibility = () => {
        // Nếu cuộn xuống hơn 300px, thì hiển thị nút
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // 2. Hàm xử lý khi click: cuộn lên đầu (mượt mà)
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Cuộn mượt
        });
    };

    // 3. Đăng ký và Hủy đăng ký sự kiện
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []); 

    return (
        <div className="scroll-to-top">
            <button
                type="button"
                onClick={scrollToTop}
                // Thêm class 'visible' nếu isVisible là true
                className={`scroll-to-top-button ${isVisible ? 'visible' : ''}`}
            >
                ↑
            </button>
        </div>
    );
}

export default ScrollToTopButton;