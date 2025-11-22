// frontend/src/App.js
import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { jwtDecode } from 'jwt-decode'; 
import { userLogout } from './redux/userSlice'; 

// Import Components
import Navigation from './components/Navigation'; 
import Footer from './components/Footer'; 
import ScrollToTopButton from './components/ScrollToTopButton';
import Toast from './components/Toast'; 

// Import Pages
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import PaymentSimulationPage from './pages/PaymentSimulationPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

// Import Admin Pages
import ProductAdminPage from './pages/admin/ProductAdminPage'; // <-- THÊM CÁI NÀY
import AddProductPage from './pages/admin/AddProductPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CategoryAdminPage from './pages/admin/CategoryAdminPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';

function App() {
    const dispatch = useDispatch();

    // Kiểm tra Token hết hạn
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const tokenExpiry = decodedToken.exp * 1000; 
                if (tokenExpiry < Date.now()) {
                    dispatch(userLogout());
                }
            } catch (error) {
                dispatch(userLogout()); // Token lỗi thì logout luôn
            }
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Navigation /> 
            
            {/* Component hiển thị thông báo (Toast) nên để ở đây */}
            <Toast /> 

            <Routes>
                {/* --- KHÁCH HÀNG --- */}
                <Route path="/" element={<HomePage />} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* === 1. SỬA LỖI: Đổi path thành /order-success/:id cho khớp với Checkout === */}
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                
                {/* Để tương thích ngược (nếu lỡ có chỗ nào link tới /order) */}
                <Route path="/order/:id" element={<OrderSuccessPage />} />

                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/payment-simulation/:id" element={<PaymentSimulationPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* --- ADMIN --- */}
                {/* === 2. THÊM ROUTE QUẢN LÝ SẢN PHẨM === */}
                <Route path="/admin/products" element={<ProductAdminPage />} />
                
                <Route path="/admin/add-product" element={<AddProductPage />} />
                
                {/* Sửa lại đường dẫn edit cho chuẩn RESTful (tuỳ chọn) */}
                <Route path="/admin/product/:id" element={<ProductEditPage />} />
                <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                
                <Route path="/admin/categories" element={<CategoryAdminPage />}/>
                <Route path="/admin/orders" element={<AdminOrderListPage />} />
            </Routes>

            <ScrollToTopButton />
            <Footer /> 
        </BrowserRouter>
    );
}

export default App;