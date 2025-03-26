import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './foodList.css';

const BASE_URL = 'http://localhost:8080';

const FoodList = () => {
    const [allFoods, setAllFoods] = useState([]);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho tìm kiếm và danh mục
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Giỏ hàng
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    const [votes, setVotes] = useState(() => {
        const savedVotes = localStorage.getItem('votes');
        return savedVotes ? JSON.parse(savedVotes) : {};
    });

    const navigate = useNavigate();

    // Helper: Lấy accessToken từ localStorage
    const getToken = () => {
        const token = localStorage.getItem('accessToken');
        return token && token.trim() !== '' ? token : null;
    };

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/food`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log('Foods from server:', data);

            setAllFoods(data);
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

    const fetchCategories = async () => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/category`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log('Categories from server:', data);

            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Không thể tải danh mục món ăn');
        }
    };

    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!allFoods || allFoods.length === 0) {
            setFoods([]);
            return;
        }

        const lowerSearch = searchTerm.toLowerCase();

        const filtered = allFoods.filter(food => {
            const matchSearch =
                food.name.toLowerCase().includes(lowerSearch) ||
                (food.description && food.description.toLowerCase().includes(lowerSearch));

            let matchCategory = true;
            if (selectedCategory !== 'all') {
                // So sánh theo field categoryName (do backend trả về)
                matchCategory = (food.categoryName === selectedCategory);
            }

            return matchSearch && matchCategory;
        });

        setFoods(filtered);
    }, [searchTerm, selectedCategory, allFoods]);

    const handleAddToCart = (food) => {
        const token = getToken();
        if (!token) {
            message.warning('Bạn cần đăng nhập để thêm vào giỏ hàng');
            navigate('/login');
            return;
        }

        const existingItem = cartItems.find(item => item.uuid === food.uuid);
        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.uuid === food.uuid
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...food, quantity: 1 }];
        }
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        message.success('Đã thêm món ăn vào giỏ hàng');
    };

    const handleToggleFavorite = (food) => {
        const updatedFavorites = favorites.includes(food.uuid)
            ? favorites.filter(id => id !== food.uuid)
            : [...favorites, food.uuid];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        message.success(
            favorites.includes(food.uuid)
                ? 'Đã xóa món ăn khỏi danh sách yêu thích'
                : 'Đã thêm món ăn vào danh sách yêu thích'
        );
    };

    const handleVote = (food, stars) => {
        const updatedVotes = { ...votes };
        if (votes[food.uuid] === stars) {
            // If the same star is clicked again, remove the vote
            delete updatedVotes[food.uuid];
            message.success('Bạn đã hủy đánh giá sao cho món ăn');
        } else {
            // Otherwise, set the new vote
            updatedVotes[food.uuid] = stars;
            message.success(`Bạn đã đánh giá ${stars} sao cho món ăn`);
        }
        setVotes(updatedVotes);
        localStorage.setItem('votes', JSON.stringify(updatedVotes));
    };

    return (
        <div className="food-list-container">
            {/* Header */}
            <div className="food-list-header">
                <div className="header-content">
                    <h2>Danh Sách Món Ăn</h2>

                    {/* Khu vực lọc + giỏ hàng */}
                    <div className="filters">
                        {/* Search bar */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Tìm kiếm món ăn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Dropdown chọn danh mục */}
                        <select
                            className="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.uuid} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nút Giỏ hàng */}
                    <div className="header-actions">
                        <button 
                            className="cart-btn"
                            onClick={() => {
                                const token = getToken();
                                if (!token) {
                                    message.warning('Bạn cần đăng nhập để xem giỏ hàng');
                                    navigate('/login');
                                    return;
                                }
                                navigate('/cart');
                            }}
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

            {/* Hiển thị loading */}
            {loading && (
                <div className="food-list-loading">
                    <Spin size="large" />
                </div>
            )}

            {/* Danh sách món ăn */}
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
                            <button 
                                className="favorite-btn"
                                onClick={() => handleToggleFavorite(food)}
                            >
                                {favorites.includes(food.uuid) ? (
                                    <HeartFilled style={{ color: 'red' }} />
                                ) : (
                                    <HeartOutlined />
                                )}
                                
                            </button>
                        </div>
                        <div className="food-content">
                            <h3 className="food-name">{food.name}</h3>
                            <p className="food-description">{food.description}</p>
                            <span className="food-price">
                                {food.price?.toLocaleString('vi-VN')}đ
                            </span>
                            <button 
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(food)}
                            >
                                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                            </button>
                            <div className="food-vote">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        className="vote-btn"
                                        onClick={() => handleVote(food, star)}
                                    >
                                        {votes[food.uuid] >= star ? (
                                            <StarFilled style={{ color: 'gold' }} />
                                        ) : (
                                            <StarOutlined />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && foods.length === 0 && (
                <p className="food-list-error">
                    Không tìm thấy món ăn phù hợp
                </p>
            )}
        </div>
    );
};

export default FoodList;
