import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Descriptions, Spin, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const statusMapping = {
  'BẾP ĐÃ NHẬN': { display: 'Bếp đã nhận', color: 'orange' },
  'ĐÃ LÀM XONG': { display: 'Đã làm xong', color: 'green' },
  'HỦY ĐƠN': { display: 'Hủy đơn', color: 'red' },
  'LIÊN HỆ': { display: 'Liên hệ với nhân viên phụ trách', color: 'purple' },
};

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
    // Ưu tiên lấy đơn hàng từ Local Storage (đã được gửi từ /checkout)
    const localOrders = localStorage.getItem('orders');
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/order/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

  // Hủy đơn hàng (nếu đơn hàng đang ở trạng thái PENDING, ví dụ)
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
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status: 'HỦY ĐƠN' }),
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
      },
    });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus', // hoặc dùng `status` nếu backend trả về tên khác
      key: 'orderStatus',
      render: (status) => {
        // Dùng mapping để hiển thị trạng thái đẹp hơn
        const mapping = statusMapping[status] || { display: status, color: 'blue' };
        return <Tag color={mapping.color}>{mapping.display}</Tag>;
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => showOrderDetails(record)}>Xem</Button>
          {record.orderStatus === 'BẾP ĐÃ NHẬN' && (
            <Button danger onClick={() => cancelOrder(record.uuid)}>
              Hủy
            </Button>
          )}
        </>
      ),
    },
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
          </Button>,
        ]}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Status">
              {statusMapping[selectedOrder.orderStatus]
                ? statusMapping[selectedOrder.orderStatus].display
                : selectedOrder.orderStatus}
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
