import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaReceipt, FaSearch, FaFileAlt } from 'react-icons/fa';
import HeaderComponent from '../../../layout/DashboardLayout/HeaderComponent';
import FooterComponent from '../../../layout/DashboardLayout/FooterComponent';
import { useToast } from '../../../components/Toast/Toast';
import './Orders.css';

const OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    DELIVERING: 'DELIVERING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

const OrderStatusLabels = {
    [OrderStatus.PENDING]: 'Chờ xác nhận',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PREPARING]: 'Đang chuẩn bị',
    [OrderStatus.DELIVERING]: 'Đang giao hàng',
    [OrderStatus.COMPLETED]: 'Đã hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy'
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('accessToken');
        const userUuid = localStorage.getItem('userUuid');

        if (!token || !userUuid) {
            addToast('Vui lòng đăng nhập để xem đơn hàng!', 'error');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/orders/${userUuid}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    addToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', 'error');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            addToast('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderUuid) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        setCancellingOrder(orderUuid);

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderUuid}/cancel`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    addToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', 'error');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to cancel order');
            }

            addToast('Đã hủy đơn hàng thành công!', 'success');
            fetchOrders();
        } catch (err) {
            console.error('Error cancelling order:', err);
            addToast('Không thể hủy đơn hàng. Vui lòng thử lại sau!', 'error');
        } finally {
            setCancellingOrder(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'status-pending';
            case OrderStatus.CONFIRMED:
                return 'status-confirmed';
            case OrderStatus.PREPARING:
                return 'status-preparing';
            case OrderStatus.DELIVERING:
                return 'status-delivering';
            case OrderStatus.COMPLETED:
                return 'status-completed';
            case OrderStatus.CANCELLED:
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = (
            order.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone.includes(searchTerm)
        );
        const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div>
                <HeaderComponent />
                <div className="container">
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>Đang tải danh sách đơn hàng...</p>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div>
            <HeaderComponent />
            <div className="container">
                <div className="orders-container">
                    <div className="orders-header">
                        <h2><FaReceipt /> Đơn hàng của bạn</h2>
                        <div className="filters">
                            <div className="search-bar">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm đơn hàng..."
                                />
                                {searchTerm && (
                                    <button 
                                        className="clear-search"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="status-filter"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.entries(OrderStatusLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <FaFileAlt className="no-orders-icon" />
                            <p>Không tìm thấy đơn hàng nào</p>
                            <button onClick={() => navigate('/menu')}>Đặt hàng ngay</button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order) => (
                                <div key={order.uuid} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Đơn hàng #{order.uuid.slice(-8)}</h3>
                                            <span className={`order-status ${getStatusClass(order.status)}`}>
                                                {OrderStatusLabels[order.status]}
                                            </span>
                                        </div>
                                        <div className="order-date">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="item-info">
                                                    <span className="item-quantity">{item.quantity}x</span>
                                                    <span className="item-name">{item.food.name}</span>
                                                </div>
                                                <span className="item-price">
                                                    {(item.food.price * item.quantity).toLocaleString()}đ
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-details">
                                            <div>
                                                <strong>Người nhận:</strong> {order.fullName}
                                            </div>
                                            <div>
                                                <strong>SĐT:</strong> {order.phone}
                                            </div>
                                            <div>
                                                <strong>Địa chỉ:</strong> {order.address}
                                            </div>
                                            {order.note && (
                                                <div>
                                                    <strong>Ghi chú:</strong> {order.note}
                                                </div>
                                            )}
                                        </div>
                                        <div className="order-actions">
                                            <div className="order-total">
                                                <strong>Tổng tiền:</strong>
                                                <span>{order.totalAmount.toLocaleString()}đ</span>
                                            </div>
                                            {order.status === OrderStatus.PENDING && (
                                                <button
                                                    className={`cancel-btn ${cancellingOrder === order.uuid ? 'loading' : ''}`}
                                                    onClick={() => handleCancelOrder(order.uuid)}
                                                    disabled={cancellingOrder === order.uuid}
                                                >
                                                    {cancellingOrder === order.uuid ? 'Đang hủy...' : 'Hủy đơn hàng'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default Orders;
