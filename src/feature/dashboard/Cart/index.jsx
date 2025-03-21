import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Voucher
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);

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

    // Cập nhật số lượng
    const handleUpdateQuantity = (itemId, change) => {
        const updatedCart = cartItems
            .map(item => {
                if (item.uuid === itemId) {
                    const newQuantity = (item.quantity || 1) + change;
                    if (newQuantity < 1) return null; // Không cho < 1
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
            .filter(Boolean);

        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    // Xóa món khỏi giỏ
    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.uuid !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    // Tính tổng (chưa tính giảm giá)
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price || 0) * (item.quantity || 1);
        }, 0);
    };

const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === 'DISCOUNT10') {
        const discountValue = calculateTotal() * 0.1;
        setDiscount(discountValue);
        localStorage.setItem('cartDiscount', discountValue);
        alert('Áp dụng mã giảm giá thành công! Giảm 10%.');
    } else {
        setDiscount(0);
        localStorage.setItem('cartDiscount', 0);
        alert('Mã giảm giá không hợp lệ!');
    }
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

    const totalAfterDiscount = calculateTotal() - discount;

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
                                    <button onClick={() => handleUpdateQuantity(item.uuid, -1)}>
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity || 1}</span>
                                    <button onClick={() => handleUpdateQuantity(item.uuid, 1)}>
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

                <div className="voucher-section">
                    <input
                        type="text"
                        className="voucher-input"
                        placeholder="Nhập mã giảm giá..."
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button className="voucher-apply-btn" onClick={handleApplyVoucher}>
                        Áp dụng
                    </button>
                </div>

                <div className="cart-summary">
                    {discount > 0 && (
                        <div className="discount-amount">
                            <span>Giảm giá:</span>
                            <span>- {discount.toLocaleString('vi-VN')} VND</span>
                        </div>
                    )}
                    <div className="total-amount">
                        <span>Tổng cộng:</span>
                        <span>{totalAfterDiscount.toLocaleString('vi-VN')} VND</span>
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
