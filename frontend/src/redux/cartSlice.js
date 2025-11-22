// frontend/src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Lấy giỏ hàng từ localStorage khi tải trang
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm vào giỏ hàng
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

    // 2. Xóa khỏi giỏ hàng (Hàm này đang thiếu -> Gây lỗi Build)
    removeFromCart: (state, action) => {
      // action.payload là ID sản phẩm cần xóa
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 3. Cập nhật số lượng (Hàm này đang thiếu -> Gây lỗi Build)
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x.id === id);
      if (item) {
        item.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },

    // 4. Xóa sạch giỏ hàng
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

// === QUAN TRỌNG: Phải xuất đủ 4 hàm này ra ===
export const { addToCart, removeFromCart, updateCartQty, clearCart } = cartSlice.actions;

export default cartSlice.reducer;