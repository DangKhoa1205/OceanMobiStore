// frontend/src/components/Toast.js
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/toastSlice';
import './Toast.css';

function Toast() {
    const { isOpen, message, type, duration } = useSelector((state) => state.toast);
    const dispatch = useDispatch();
    const timeoutRef = useRef(null); // Để lưu ID của timer

    useEffect(() => {
        if (isOpen) {
            // Đặt timer để tự động đóng toast
            timeoutRef.current = setTimeout(() => {
                dispatch(hideToast());
            }, duration);
        }

        // Cleanup function: Xóa timer nếu component unmount hoặc toast bị đóng sớm
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen, duration, dispatch]); // Chạy lại khi isOpen hoặc duration thay đổi

    // Nếu không mở, không hiển thị gì cả
    if (!isOpen) {
        return null;
    }

    // Chọn icon và class CSS dựa trên type
    const toastClass = `toast-container toast-${type}`;
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✔'; // Hoặc icon font awesome nếu có
            break;
        case 'error':
            icon = '✖';
            break;
        case 'info':
            icon = 'ℹ';
            break;
        case 'warning':
            icon = '⚠';
            break;
        default:
            icon = '';
    }

    return (
        <div 
            className={toastClass}
            style={{ '--toast-duration': `${duration / 1000}s` }} // Truyền duration vào CSS
        >
            {icon && <span className="toast-icon">{icon}</span>}
            <span>{message}</span>
        </div>
    );
}

export default Toast;