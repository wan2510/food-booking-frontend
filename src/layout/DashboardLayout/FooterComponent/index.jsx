import React from 'react';
import { Layout, Row, Col, Typography, Space, Input, Button, Divider } from 'antd';
import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './footer.css';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const FooterComponent = () => {
  return (
    <Footer className="footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          {/* Thông tin về nhà hàng */}
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-section">
              <Title level={3} className="footer-title">Nomster</Title>
              <Paragraph className="footer-description">
                Khám phá ẩm thực tuyệt vời tại Nomster. Chúng tôi mang đến những trải nghiệm ẩm thực độc đáo và phục vụ chu đáo.
              </Paragraph>
              <Space className="footer-social-links">
                <a href="#" className="social-link"><FacebookFilled /></a>
                <a href="#" className="social-link"><TwitterOutlined /></a>
                <a href="#" className="social-link"><InstagramOutlined /></a>
                <a href="#" className="social-link"><YoutubeFilled /></a>
              </Space>
            </div>
          </Col>

          {/* Liên kết nhanh */}
          <Col xs={24} sm={12} md={8} lg={8}>
            <div className="footer-section">
              <Title level={3} className="footer-title">Liên Kết Nhanh</Title>
              <ul className="footer-links">
                <li><Link to="/about">Về chúng tôi</Link></li>
                <li><Link to="/menu">Thực đơn</Link></li>
                <li><Link to="/book">Đặt bàn</Link></li>
                <li><Link to="/contact">Liên hệ</Link></li>
                <li><Link to="/privacy">Chính sách bảo mật</Link></li>
                <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </Col>

          {/* Liên hệ và đăng ký */}
          <Col xs={24} sm={12} md={8} lg={8}>
            <div className="footer-section">
              <Title level={3} className="footer-title">Liên Hệ</Title>
              <Space direction="vertical" size={16} className="contact-info">
                <Space>
                  <EnvironmentOutlined />
                  <Text>123 Đường ABC, Quận XYZ, TP.HCM</Text>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <Text>+84 123 456 789</Text>
                </Space>
                <Space>
                  <MailOutlined />
                  <Text>info@nomster.com</Text>
                </Space>
              </Space>

              <Divider className="footer-divider" />

              <div className="newsletter">
                <Title level={4} className="newsletter-title">Đăng ký nhận tin</Title>
                <Space.Compact style={{ width: '100%' }}>
                  <Input placeholder="Email của bạn" />
                  <Button type="primary" icon={<SendOutlined />}>
                    Đăng ký
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="footer-bottom-divider" />
      
      <div className="footer-bottom">
        <Text>© 2024 Nomster. Tất cả quyền được bảo lưu.</Text>
        <Space split={<Divider type="vertical" />}>
          <Link to="/privacy">Chính sách bảo mật</Link>
          <Link to="/terms">Điều khoản</Link>
          <Link to="/sitemap">Sơ đồ trang</Link>
        </Space>
      </div>
    </Footer>
  );
};

export default FooterComponent;