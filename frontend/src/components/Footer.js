// frontend/src/components/Footer.js
import React from 'react';
import './Footer.css'; 


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Về OceanMobiStore</h4>
          <p>Chuyên cung cấp các sản phẩm di động chính hãng (iPhone, Samsung,...) với giá tốt nhất thị trường. Uy tín tạo nên thương hiệu.</p>
        </div>

        {/* === KHỐI TRA CỨU ĐƠN HÀNG ĐÃ ĐƯỢC XÓA KHỎI ĐÂY === */}

        <div className="footer-section">
          <h4>Thông tin Liên hệ</h4>
          <ul>
            <li>Địa chỉ: 236B Đường Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. HCM</li>
            <li>Hotline: 0378.219.123</li>
            <li>Email: support@oceanmobistore.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Theo dõi chúng tôi</h4>
          <ul className="social-links">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">Tiktok</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 OceanMobiStore. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;