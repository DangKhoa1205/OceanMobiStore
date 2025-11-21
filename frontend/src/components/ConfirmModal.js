// frontend/src/components/ConfirmModal.js
import React from 'react';
import './ConfirmModal.css'; // Import CSS

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    
    // Nếu không mở, không hiển thị gì cả
    if (!isOpen) {
        return null;
    }

    return (
        // Lớp nền mờ
        <div className="modal-overlay" onClick={onClose}>
            {/* Hộp thoại (click vào đây sẽ không đóng) */}
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <h2 className="modal-title">{title || 'Xác nhận'}</h2>
                    <p className="modal-message">
                        {message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
                    </p>
                    <div className="modal-buttons">
                        <button 
                            className="modal-button modal-button-cancel" 
                            onClick={onClose}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            className="modal-button modal-button-confirm" 
                            onClick={onConfirm}
                        >
                            Xác nhận Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;