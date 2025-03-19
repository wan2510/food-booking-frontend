import React, { useEffect, useState } from "react";
import { Button, Table, message, Card, Empty } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getCartItems, updateCartItemQuantity, removeFromCart } from "../../api/CartApi";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const items = await getCartItems();
            setCartItems(items);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
            message.error("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleUpdateQuantity = (uuid, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity <= 0) {
            handleRemoveItem(uuid);
            return;
        }
        updateCartItemQuantity(uuid, newQuantity);
        fetchCartItems();
    };

    const handleRemoveItem = (uuid) => {
        removeFromCart(uuid);
        message.success("Đã xóa món ăn khỏi giỏ hàng");
        fetchCartItems();
    };

    const columns = [
        {
            title: 'Món ăn',
            key: 'food',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <img 
                        src={record.food.imageUrl || 'https://via.placeholder.com/100'} 
                        alt={record.food.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100';
                        }}
                    />
                    <div>
                        <div className="font-medium text-lg">{record.food.name}</div>
                        <div className="text-gray-500">{record.food.description}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: ['food', 'price'],
            key: 'price',
            render: (price) => (
                <div className="text-orange-500 font-medium">
                    {price?.toLocaleString('vi-VN')} VND
                </div>
            ),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            width: 200,
            render: (_, record) => (
                <div className="flex items-center gap-3 justify-center">
                    <Button 
                        type="primary"
                        ghost
                        shape="circle"
                        icon={<MinusOutlined />} 
                        onClick={() => handleUpdateQuantity(record.uuid, record.quantity, -1)}
                    />
                    <span className="text-lg w-8 text-center">{record.quantity}</span>
                    <Button 
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />} 
                        onClick={() => handleUpdateQuantity(record.uuid, record.quantity, 1)}
                    />
                </div>
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => (
                <div className="text-red-500 font-medium text-lg">
                    {(record.food.price * record.quantity).toLocaleString('vi-VN')} VND
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button 
                    danger 
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.uuid)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <DefaultLayout>
                <div className="container mx-auto py-8 px-4">
                    <Card loading={true}>
                        <div style={{ height: "400px" }}></div>
                    </Card>
                </div>
            </DefaultLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <DefaultLayout>
                <div className="container mx-auto py-12 px-4">
                    <Card className="text-center">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="space-y-4">
                                    <p className="text-lg">Giỏ hàng của bạn đang trống</p>
                                    <Button 
                                        type="primary" 
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => navigate('/foodlist')}
                                    >
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            }
                        />
                    </Card>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Giỏ hàng của tôi</h2>
                        <Button 
                            type="primary" 
                            ghost
                            icon={<ShoppingCartOutlined />}
                            onClick={() => navigate('/foodlist')}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={cartItems}
                        rowKey="uuid"
                        pagination={false}
                        className="cart-table"
                        summary={(data) => {
                            const total = data.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3}>
                                        <span className="text-lg font-medium">Tổng cộng</span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} colSpan={2}>
                                        <span className="text-xl font-bold text-red-500">
                                            {total.toLocaleString('vi-VN')} VND
                                        </span>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    />
                </Card>
            </div>
        </DefaultLayout>
    );
};

export default CartPage;
