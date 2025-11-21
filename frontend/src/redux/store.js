// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice'; // <-- 1. IMPORT USER REDUCER
import toastReducer from './toastSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer, // <-- 2. THÊM USER REDUCER
        toast: toastReducer,
    },
});

export default store;