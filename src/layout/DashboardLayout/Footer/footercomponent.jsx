import React from "react";
import { Layout } from "antd";
import { FaFacebook, FaInstagram, FaPinterest, FaTwitter, FaPhone } from "react-icons/fa";
import "./footer.css";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="footer">
      <div className="footer-container">
        {/* Logo & About Us */}
        <div className="footer-section about">
          <h2 className="logo">
          <img src="/icon.jpg" alt="Nomster Logo" className="logo-img" />
          Nomster
          </h2>
          <p>
            Ăn Thả Ga 
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaPinterest /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="#">Thông tin mới nhất</a></li>
            <li><a href="/food">Món ăn</a></li>
            <li><a href="/book">Đặt bàn ngay</a></li>
            <li><a href="#">Dịch vụ và cài đặt</a></li>
            <li><a href="#">Món ăn sắp ra mắt</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Hãy liên lạc với chúng tôi nếu như gặp vấn đề!</h3>
          <p className="phone">
            <FaPhone className="phone-icon" /> 0393095515
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © Nomster. All Right Reserved</p>
      </div>
    </Footer>
  );
};

export default FooterComponent;
