// frontend/src/pages/PaymentSimulationPage.js
import React from 'react'; // <-- 1. XÓA useEffect
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo'; 
import './PaymentSimulationPage.css'; 

function PaymentSimulationPage() {
    const navigate = useNavigate();
    const { id: orderId } = useParams(); // Lấy ID đơn hàng
    const [searchParams] = useSearchParams();
    const paymentMethod = searchParams.get('method'); // Sẽ là 'Momo', 'VNPay'

    // === 2. BỘ ĐẾM THỜI GIAN (useEffect) ĐÃ BỊ XÓA ===

    // (Cài đặt QR Code động... giữ nguyên)
    let paymentTitle = "Quét mã QR để thanh toán";
    let qrLogo = "/logo.png";
    let fakePaymentData = `https://oceanmobistore.com/pay?order_id=${orderId}`;

    if (paymentMethod === 'Momo') {
        paymentTitle = "Quét mã Momo để thanh toán";
        qrLogo = "/images/momo.webp";
        fakePaymentData = `momo://pay?order_id=${orderId}`; 
    } else if (paymentMethod === 'VNPay') {
        paymentTitle = "Quét mã VNPay để thanh toán";
        qrLogo = "/images/vnpay.jpg"; 
        fakePaymentData = `vnpay://pay?order_id=${orderId}`;
    }

    // === 3. TẠO HÀM MỚI CHO NÚT BẤM ===
    const handleConfirmation = () => {
        // Chuyển người dùng đến trang thành công
        navigate(`/order/${orderId}`);
    };

    return (
        <div className="main-container">
            <div className="payment-simulation-container">
                
                <h2 style={{marginTop: 0}}>{paymentTitle}</h2>
                <p>Đơn hàng: #{orderId}</p>

                <div className="qr-code-wrapper">
                    <QRCode 
                        value={fakePaymentData} 
                        size={220} 
                        logoImage={qrLogo} 
                        logoWidth={60} 
                        logoHeight={60}
                        qrStyle="squares"
                        eyeRadius={5}
                    />
                </div>
                
                {/* === 4. THAY ĐỔI VĂN BẢN HƯỚNG DẪN === */}
                <p style={{color: '#555', fontStyle: 'italic', marginTop: '1rem'}}>
                    Vui lòng quét mã và nhấn xác nhận sau khi hoàn tất.
                </p>

                {/* === 5. THÊM NÚT XÁC NHẬN MỚI === */}
                <button 
                    onClick={handleConfirmation} 
                    className="payment-confirm-button"
                >
                    Tôi đã hoàn tất thanh toán
                </button>
            </div>
        </div>
    );
}

export default PaymentSimulationPage;