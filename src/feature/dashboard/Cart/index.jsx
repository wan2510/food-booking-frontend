import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCartItems = () => {
            try {
                const savedCart = localStorage.getItem('cartItems');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Lỗi khi tải giỏ hàng:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    const handleUpdateQuantity = (itemId, change) => {
        const updatedCart = cartItems.map(item => {
            if (item.uuid === itemId) {
                const newQuantity = (item.quantity || 1) + change;
                if (newQuantity < 1) return null;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean);

        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.uuid !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price || 0) * (item.quantity || 1);
        }, 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="empty-cart">
                    <FaShoppingCart className="empty-cart-icon" />
                    <h2>Giỏ hàng trống</h2>
                    <p>Hãy thêm món ăn vào giỏ hàng của bạn</p>
                    <button 
                        className="continue-shopping-btn"
                        onClick={() => navigate('/foodlist')}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Giỏ hàng của tôi</h1>
                    <button 
                        className="continue-shopping-btn"
                        onClick={() => navigate('/foodlist')}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.uuid} className="cart-item">
                            <div className="item-image">
                                <img 
                                    src={item.imageUrl || 'https://via.placeholder.com/100'} 
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100';
                                    }}
                                />
                            </div>
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-description">{item.description}</p>
                                <div className="item-price">{item.price?.toLocaleString('vi-VN')} VND</div>
                            </div>
                            <div className="item-actions">
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.uuid, -1)}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity || 1}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.uuid, 1)}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item.uuid)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="item-total">
                                {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} VND
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="total-amount">
                        <span>Tổng cộng:</span>
                        <span>{calculateTotal().toLocaleString('vi-VN')} VND</span>
                    </div>
                    <button 
                        className="checkout-btn"
                        onClick={() => navigate('/checkout')}
                    >
                        <FaMoneyBillWave />
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;