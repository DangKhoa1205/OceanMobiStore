// frontend/src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Lấy giỏ hàng từ localStorage khi tải trang (để F5 không mất hàng)
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
        // Nếu sản phẩm đã có, cập nhật lại số lượng/thông tin
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? item : x
        );
      } else {
        // Nếu chưa có, thêm mới vào
        state.cartItems = [...state.cartItems, item];
      }
      
      // Lưu ngay vào bộ nhớ trình duyệt
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 2. Xóa khỏi giỏ hàng (ĐÂY LÀ HÀM BẠN ĐANG THIẾU)
    removeFromCart: (state, action) => {
      // action.payload là ID sản phẩm cần xóa
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 3. Xóa sạch giỏ hàng (Dùng khi đặt hàng xong)
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

// Xuất các hàm ra để các trang khác dùng
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;