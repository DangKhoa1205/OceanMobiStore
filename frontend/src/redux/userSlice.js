// frontend/src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Lấy thông tin user từ localStorage (nếu có)
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
    // 1. Đăng nhập
    userLogin: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // 2. Đăng xuất
    userLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
    // 3. Cập nhật hồ sơ (ĐÂY LÀ HÀM CÒN THIẾU)
    userUpdateProfile: (state, action) => {
      state.userInfo = action.payload;
      // Cập nhật lại localStorage luôn để F5 không bị mất dữ liệu mới
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
  },
});

// Xuất các action ra để dùng ở các trang khác
export const { userLogin, userLogout, userUpdateProfile } = userSlice.actions;

export default userSlice.reducer;