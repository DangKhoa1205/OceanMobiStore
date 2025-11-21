// frontend/src/utils/api.js
import axios from 'axios';

// Tự động lấy link từ biến môi trường, nếu không có thì dùng localhost
const BASE_URL = process.env.REACT_APP_API_URL || 'https://ocean-backend.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;