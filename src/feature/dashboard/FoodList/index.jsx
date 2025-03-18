import React, { useEffect, useState } from 'react';
import { Row, Col, Card, message, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './foodList.css';

const BASE_URL = 'http://localhost:8080';

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const navigate = useNavigate();

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/food`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched foods:', data);
            setFoods(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching foods:', error);
            setError('Không thể tải danh sách món ăn');
            message.error('Không thể tải danh sách món ăn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleAddToCart = (food) => {
        // Kiểm tra xem món ăn đã có trong giỏ hàng chưa
        const existingItem = cartItems.find(item => item.uuid === food.uuid);
        
        let updatedCart;
        if (existingItem) {
            // Nếu món ăn đã có trong giỏ, tăng số lượng
            updatedCart = cartItems.map(item =>
                item.uuid === food.uuid
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
        } else {
            // Nếu món ăn chưa có trong giỏ, thêm mới với số lượng là 1
            updatedCart = [...cartItems, { ...food, quantity: 1 }];
        }

        // Cập nhật state và localStorage
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        
        // Hiển thị thông báo thành công
        message.success('Đã thêm món ăn vào giỏ hàng');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Đang tải danh sách món ăn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchFoods}>Thử lại</button>
            </div>
        );
    }

    return (
        <div className="food-list-container">
            <div className="food-list-header">
                <div className="header-content">
                    <h2>Danh Sách Món Ăn</h2>
                    <div className="header-actions">
                        <button 
                            className="cart-btn"
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingCartOutlined />
                            Giỏ hàng
                            {cartItems.length > 0 && (
                                <span className="cart-count">
                                    {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="food-grid">
                {foods.map((food) => (
                    <div key={food.uuid} className="food-card">
                        <div className="food-image-container">
                            <img 
                                alt={food.name} 
                                src={food.imageUrl} 
                                className="food-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/default-food.png';
                                }}
                            />
                            {food.tag && <span className="food-tag">{food.tag}</span>}
                        </div>
                        <div className="food-content">
                            <h3 className="food-name">{food.name}</h3>
                            <p className="food-description">{food.description}</p>
                            <span className="food-price">{food.price?.toLocaleString('vi-VN')}đ</span>
                            <button 
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(food)}
                            >
                                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;