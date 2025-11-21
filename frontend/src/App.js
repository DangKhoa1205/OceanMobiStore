// frontend/src/App.js
import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { jwtDecode } from 'jwt-decode'; 
import { userLogout } from './redux/userSlice'; 

import Navigation from './components/Navigation'; 
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AddProductPage from './pages/admin/AddProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import CategoryAdminPage from './pages/admin/CategoryAdminPage';
import TrackOrderPage from './pages/TrackOrderPage';
import Toast from './components/Toast'; 
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import PaymentSimulationPage from './pages/PaymentSimulationPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const dispatch = useDispatch(); // <-- 5. KHỞI TẠO DISPATCH

    // === 6. KIỂM TRA TOKEN KHI APP KHỞI ĐỘNG ===
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            const tokenExpiry = decodedToken.exp * 1000; 

            if (tokenExpiry < Date.now()) {
                dispatch(userLogout());
            }
        }
    }, [dispatch]); // Chạy 1 lần khi app load

    return (
        <BrowserRouter>
            <Navigation /> 

            <Routes>
                <Route path="/" element={<HomePage />} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/admin/add-product" element={<AddProductPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                <Route path="/order/:id" element={<OrderSuccessPage />} />
                <Route path="/admin/categories" element={<CategoryAdminPage />}/>
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/admin/orders" element={<AdminOrderListPage />} />
                <Route path="/payment-simulation/:id" element={<PaymentSimulationPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>

            <Footer /> 
            
            <ScrollToTopButton />
            
            
            <Toast />
            
        </BrowserRouter>
    );
}

export default App;