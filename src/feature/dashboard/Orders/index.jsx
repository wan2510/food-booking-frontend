import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Descriptions, Spin, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userUuid = localStorage.getItem('userUuid');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!userUuid) {
      notification.warning({ message: 'User chưa đăng nhập' });
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/order/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errorMessage || 'Không thể lấy đơn hàng');
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      notification.error({ message: error.message });
    }
    setLoading(false);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const cancelOrder = (orderUuid) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      onOk: async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/order/${orderUuid}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ status: 'CANCELLED' })
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.errorMessage || 'Không thể cập nhật đơn hàng');
          }
          const updatedOrder = await res.json();
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.uuid === updatedOrder.uuid ? updatedOrder : order
            )
          );
          notification.success({ message: 'Hủy đơn hàng thành công' });
        } catch (error) {
          notification.error({ message: error.message });
        }
      }
    });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'uuid',
      key: 'uuid'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'COMPLETED') color = 'green';
        else if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString('vi-VN')} đ`
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => showOrderDetails(record)}>Xem</Button>
          {record.status === 'PENDING' && (
            <Button danger onClick={() => cancelOrder(record.uuid)}>
              Hủy
            </Button>
          )}
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Đơn hàng của tôi</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="uuid" />
      )}

      <Modal
        title={`Chi tiết đơn hàng: ${selectedOrder?.uuid}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Status">
              {selectedOrder.status}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              {selectedOrder.totalPrice?.toLocaleString('vi-VN')} đ
            </Descriptions.Item>
            <Descriptions.Item label="Order Items">
              <ul>
                {selectedOrder.items &&
                  selectedOrder.items.map((item) => (
                    <li key={item.uuid}>
                      {item.foodName} - {item.quantity} x{' '}
                      {item.price.toLocaleString('vi-VN')} đ
                    </li>
                  ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Orders;