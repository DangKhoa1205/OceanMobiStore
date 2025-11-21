// frontend/src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Lấy userInfo từ localStorage (nếu đã đăng nhập từ lần trước)
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action khi đăng nhập
    userLogin: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Action khi đăng xuất
    userLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token'); // Xóa cả token
    },
  },
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;