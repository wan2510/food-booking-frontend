import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Spin, Dropdown, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./foodExample.css";

const BASE_URL = 'http://localhost:8080';

const FoodExample = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRandomFoods = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        message.warning('Bạn cần đăng nhập để xem thực đơn');
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/food`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allFoods = await response.json();
      const shuffled = [...allFoods].sort(() => 0.5 - Math.random());
      const randomFoods = shuffled.slice(0, 6);
      
      setFoods(randomFoods);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomFoods();
    // Tự động shuffle lại mỗi 5 phút
    const interval = setInterval(fetchRandomFoods, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Hàm thêm món ăn vào giỏ hàng (giống /foodlist)
  const handleAddToCart = (food) => {
    // Kiểm tra đăng nhập
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      message.warning('Bạn cần đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    // Lấy giỏ hàng hiện tại từ localStorage
    let cartItems = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];

    // Kiểm tra món ăn đã có trong giỏ chưa
    const existingItem = cartItems.find(item => item.uuid === food.uuid);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...food, quantity: 1 });
    }

    // Lưu lại vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    message.success('Đã thêm món ăn vào giỏ hàng');
  };

  // Menu items cho Dropdown
  const getMenuItems = (food) => ({
    items: [
      {
        key: '1',
        label: 'Thêm vào giỏ hàng',
        icon: <ShoppingCartOutlined />,
        onClick: () => handleAddToCart(food),
      }
    ]
  });

  if (loading && foods.length === 0) {
    return (
      <div className="food-example-loading">
        <Spin size="large" />
        <p>Đang tải món ăn...</p>
      </div>
    );
  }

  if (error && foods.length === 0) {
    return (
      <div className="food-example-error">
        <p>{error}</p>
        <button onClick={fetchRandomFoods}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="food-example-container">
      <h2 className="section-title">Món ăn gợi ý</h2>
      <Row gutter={[16, 16]}>
        {foods.map((food) => (
          <Col key={food.uuid} xs={24} sm={12} md={8} lg={8}>
            <Card
              hoverable
              className="food-example-card"
              cover={
                <div className="food-example-image-container">
                  <img 
                    alt={food.name} 
                    src={food.imageUrl} 
                    className="food-example-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-food.png';
                    }}
                  />
                </div>
              }
              actions={[
                <Dropdown 
                  key="more" 
                  menu={getMenuItems(food)} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <ShoppingCartOutlined className="add-to-cart-icon" />
                </Dropdown>
              ]}
            >
              <Card.Meta
                title={<div className="food-example-name">{food.name}</div>}
                description={
                  <div className="food-example-details">
                    <span className="food-example-price">
                      {food.price?.toLocaleString('vi-VN')}đ
                    </span>
                    {food.description && (
                      <span className="food-example-description">
                        {food.description}
                      </span>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FoodExample;