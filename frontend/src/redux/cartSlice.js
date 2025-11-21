// frontend/src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    shippingAddress: {},
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // 1. Reducer Thêm/Cập nhật Giỏ hàng
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.id === item.id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.id === existItem.id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        // 2. Reducer Xóa khỏi giỏ hàng
        removeFromCart: (state, action) => {
            // action.payload sẽ là ID
            state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        // 3. Reducer Xóa sạch giỏ hàng
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },

        // 4. Reducer Cập nhật Số lượng
        updateCartQty: (state, action) => {
            const { id, qty } = action.payload;
            const newQty = Number(qty); // Đảm bảo là số

            if (newQty < 1) return; // Chặn số lượng < 1
            
            const existItem = state.cartItems.find((x) => x.id === id);

            if (existItem) {
                existItem.qty = newQty; // Cập nhật số lượng
            }
            
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
    },
});

// 5. Export 4 HÀNH ĐỘNG
export const { addToCart, removeFromCart, clearCart, updateCartQty } = cartSlice.actions;

export default cartSlice.reducer;