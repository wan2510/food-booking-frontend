import React from 'react';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Nomster</h3>
          <p className="footer-description">
            Khám phá ẩm thực tuyệt vời tại Nomster. Chúng tôi mang đến những trải nghiệm ẩm thực độc đáo và phục vụ chu đáo.
          </p>
          <div className="footer-social-links">
            <a href="#" className="social-link"><FacebookOutlined /></a>
            <a href="#" className="social-link"><TwitterOutlined /></a>
            <a href="#" className="social-link"><InstagramOutlined /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Liên Kết Nhanh</h3>
          <ul className="footer-links">
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Thực đơn</a></li>
            <li><a href="#">Đặt bàn</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Liên Hệ</h3>
          <div className="contact-info">
            <EnvironmentOutlined className="anticon" />
            <span>163 thôn 3 Thạch Hòa, Thạch Thất, TP. Hà Nội</span>
          </div>
          <div className="contact-info">
            <PhoneOutlined className="anticon" />
            <span>+84 393 095 515</span>
          </div>
          <div className="contact-info">
            <MailOutlined className="anticon" />
            <span>hucauvn37@gmail.com</span>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Đăng ký nhận tin</h3>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Email của bạn" />
            <button type="submit" className="newsletter-button">Gửi</button>
          </form>
        </div>
      </div>

      <hr className="footer-bottom-divider" />

      <div className="footer-bottom">
        <p className="footer-text">© 2024 Nomster. Tất cả quyền được bảo lưu</p>
        <div>
          <a href="#">Điều khoản sử dụng</a>
          <span style={{ margin: '0 10px' }}>|</span>
          <a href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 