// frontend/src/redux/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
    name: 'toast',
    initialState: {
        isOpen: false,
        message: '',
        type: 'success', // Có thể là 'success', 'error', 'info', 'warning'
        duration: 3000 // Thời gian hiển thị (miligiây)
    },
    reducers: {
        // Hàm này để hiển thị toast
        showToast: (state, action) => {
            state.isOpen = true;
            state.message = action.payload.message;
            state.type = action.payload.type || 'success';
            state.duration = action.payload.duration || 3000;
        },
        // Hàm này để đóng toast (có thể gọi tự động sau duration)
        hideToast: (state) => {
            state.isOpen = false;
            state.message = '';
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;