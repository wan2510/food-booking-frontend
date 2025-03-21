import React, { useState, useEffect } from 'react';
import { Card, List, Button, Divider, message, Modal, Spin } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadCartItems();
    loadDiscount();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      message.error('Không thể tải thông tin giỏ hàng');
      setLoading(false);
    }
  };

  const loadDiscount = () => {
    const savedDiscount = localStorage.getItem('cartDiscount');
    if (savedDiscount) {
      setDiscount(parseFloat(savedDiscount));
    } else {
      setDiscount(0);
    }
  };  

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price?.replace(/[^\d]/g, '')); 
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const handlePayment = () => {
    if (cartItems.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống');
      return;
    }
    setShowQRCode(true);
  };

  const handleCompleteOrder = async () => {
    const userUuid = localStorage.getItem('userUuid');
    if (!userUuid) {
      message.error('User chưa đăng nhập');
      return;
    }
  
    const finalTotal = calculateTotal();
  
    const orderDTO = {
      uuid: "ord-" + Date.now(),
      userUuid: userUuid,
      status: "COMPLETED",
      items: cartItems.map((item, index) => ({
        uuid: "item-" + index + "-" + Date.now(),
        foodUuid: item.uuid,
        foodName: item.name,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      totalPrice: finalTotal
    };
  
    try {
      await fetch("http://localhost:8080/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDTO)
      });
  
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartDiscount');
      setCartItems([]);
  
      setOrderComplete(true);
      message.success('Đặt hàng thành công!');
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo đơn hàng');
    }
  };
  

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="order-success">
        <CheckCircleOutlined className="success-icon" />
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.</p>
        <p>Bạn sẽ được chuyển đến trang đơn hàng sau 3 giây...</p>
        <Button type="primary" onClick={() => navigate('/orders')}>
          Xem đơn hàng của tôi
        </Button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-summary">
          <Card title="Thông tin đơn hàng" className="order-card">
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<img src={item.imageUrl} alt={item.name} className="item-image" />}
                    title={item.name}
                    description={`Số lượng: ${item.quantity || 1}`}
                  />
                  <div className="item-price">
                    {typeof item.price === 'number'
                      ? item.price.toLocaleString('vi-VN')
                      : item.price} đ
                  </div>
                </List.Item>
              )}
            />

            <Divider />

            <div className="price-summary">
              <div className="price-row">
                <span>Tạm tính:</span>
                <span>{calculateSubtotal().toLocaleString('vi-VN')} đ</span>
              </div>

              {discount > 0 && (
                <div className="price-row discount-row">
                  <span>Giảm giá:</span>
                  <span>- {discount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              <div className="price-row total">
                <span>Tổng cộng:</span>
                <span>{calculateTotal().toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handlePayment}
              className="checkout-button"
            >
              Thanh toán ngay
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        title="Quét mã QR để thanh toán"
        open={showQRCode}
        onCancel={() => setShowQRCode(false)}
        footer={[
          <Button key="back" onClick={() => setShowQRCode(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleCompleteOrder}>
            Đã thanh toán
          </Button>,
        ]}
        width={400}
        centered
      >
        <div className="qr-code-container">
          <img
            src="src/assets/image/Screenshot 2025-03-18 122744.png"
            alt="QR Code"
            className="qr-code-image"
          />
          <p className="qr-instructions">
            Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và thanh toán.
          </p>
          <div className="payment-amount">
            <span>Số tiền:</span>
            <span>{calculateTotal().toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;