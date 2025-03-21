import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, message, Space, Badge, Popconfirm, Row, Col, Card } from 'antd';
import { ShoppingCartOutlined, TableOutlined, DollarOutlined, CommentOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const NOTIFICATION_API_URL = 'http://localhost:8080/api/notification';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${NOTIFICATION_API_URL}?userId=1`);
      setNotifications(response.data.map((notif) => ({
        ...notif,
        isRead: notif.isRead || false,
      })) || []);
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
      message.error('Không thể tải thông báo. Vui lòng kiểm tra server!');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Gọi mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${NOTIFICATION_API_URL}/${id}`);
      setNotifications(notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      message.success('Đánh dấu đã đọc!');
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
      message.error('Lỗi khi đánh dấu đã đọc!');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(`${NOTIFICATION_API_URL}/mark-all-read`, null, { params: { userId: 1 } });
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
      message.success('Đã đánh dấu tất cả thông báo là đã đọc!');
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      message.error('Lỗi khi đánh dấu tất cả đã đọc!');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${NOTIFICATION_API_URL}/${id}`);
      setNotifications(notifications.filter((notif) => notif.id !== id));
      message.success('Xóa thông báo thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      message.error('Lỗi khi xóa thông báo!');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(NOTIFICATION_API_URL, { params: { userId: 1 } });
      setNotifications([]);
      message.success('Xóa tất cả thông báo thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa tất cả thông báo:', error);
      message.error('Lỗi khi xóa tất cả thông báo!');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
      case 'booking':
        return <TableOutlined style={{ fontSize: '24px', color: '#faad14' }} />;
      case 'payment':
        return <DollarOutlined style={{ fontSize: '24px', color: '#f5222d' }} />;
      case 'feedback':
        return <CommentOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type, isRead) => {
    if (isRead) return '#fff';
    switch (type) {
      case 'order':
        return '#e6f7ff';
      case 'booking':
        return '#fff7e6';
      case 'payment':
        return '#fff1f0';
      case 'feedback':
        return '#fff0f6';
      default:
        return '#e6f7ff';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Row gutter={[16, 16]} align="middle" className="mb-6">
        <Col>
          <h2 className="text-xl font-bold">Thông báo</h2>
        </Col>
        <Col>
          {notifications.length > 0 && (
            <>
              <Button type="primary" onClick={handleMarkAllAsRead} style={{ marginRight: 8 }}>
                Đánh dấu tất cả đã đọc
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa tất cả thông báo?"
                onConfirm={handleDeleteAll}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="primary" danger>
                  Xóa tất cả
                </Button>
              </Popconfirm>
            </>
          )}
        </Col>
      </Row>

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          loading={loading}
          locale={{ emptyText: 'Không có thông báo mới' }}
          renderItem={(notif) => (
            <List.Item
              actions={[
                !notif.isRead && (
                  <Button
                    type="link"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Đánh dấu đã đọc
                  </Button>
                ),
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa thông báo này?"
                  onConfirm={() => handleDeleteNotification(notif.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
              style={{
                background: getBackgroundColor(notif.type, notif.isRead),
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getIcon(notif.type)} />}
                title={
                  <span style={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                    {notif.message}
                  </span>
                }
                description={
                  <Space direction="vertical">
                    <span>{moment(notif.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                    <Badge
                      status={notif.isRead ? 'success' : 'warning'}
                      text={notif.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    />
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default NotificationsPage;