import { BellOutlined, CalendarOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Flex, message, Spin, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { BookingNotification } from './BookingNotification';
import { getNotifications, getUnreadNotifications, markAsRead, deleteNotification } from '../../../../services/notificationService';
import './notification.css';

export const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const userId = "1"; // Hard-code userId, nên lấy từ context hoặc state (ví dụ: useAuth)

    // Lấy danh sách thông báo
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications(userId);
            const notificationItems = Array.isArray(data) ? data.map((notif) => ({
                key: notif.id,
                label: (
                    <BookingNotification
                        notification={notif}
                        onMarkAsRead={() => handleMarkAsRead(notif.id)}
                        onDelete={() => handleDelete(notif.id)}
                    />
                ),
                icon: <CalendarOutlined />,
            })) : [];
            setNotifications(notificationItems);
        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
            if (error.response) {
                const errorMessage = error.response.data.errorMessage || error.response.data || 'Không thể tải thông báo';
                message.error(`Lỗi: ${errorMessage}`);
            } else {
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
            }
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Lấy số lượng thông báo chưa đọc
    const fetchUnreadCount = async () => {
        setLoading(true);
        try {
            const unreadData = await getUnreadNotifications(userId);
            setUnreadCount(Array.isArray(unreadData) ? unreadData.length : 0);
        } catch (error) {
            console.error('Lỗi khi lấy số lượng thông báo chưa đọc:', error);
            if (error.response) {
                const errorMessage = error.response.data.errorMessage || error.response.data || 'Không thể lấy số lượng thông báo chưa đọc';
                message.error(`Lỗi: ${errorMessage}`);
            } else {
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
            }
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const handleMarkAsRead = async (id) => {
        if (!id || id === "undefined") {
            console.error("Invalid notification ID:", id);
            message.error("Lỗi: ID thông báo không hợp lệ!");
            return;
        }
        console.log("Marking as read:", id); // Debug ID trước khi gọi API
    
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((item) =>
                    item.key === id
                        ? {
                              ...item,
                              label: (
                                  <BookingNotification
                                      notification={{ ...item.label.props.notification, isRead: true }}
                                      onMarkAsRead={() => handleMarkAsRead(id)}
                                      onDelete={() => handleDelete(id)}
                                  />
                              ),
                          }
                        : item
                )
            );
            setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
            message.success("Đã đánh dấu thông báo là đã đọc");
        } catch (error) {
            console.error("Lỗi khi đánh dấu đã đọc:", error);
            handleApiError(error, "Không thể đánh dấu đã đọc");
        }
    };
    

    const handleDelete = async (id) => {
        if (!id || id === "undefined") {
            console.error("Invalid notification ID:", id);
            message.error("Lỗi: ID thông báo không hợp lệ!");
            return;
        }
        console.log(" Deleting notification ID:", id); // Debug ID
    
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((item) => item.key !== id));
            message.success("Đã xóa thông báo");
        } catch (error) {
            console.error("Lỗi khi xóa thông báo:", error);
            handleApiError(error, "Không thể xóa thông báo");
        }
    };
    
    

    // Hiển thị khi không có thông báo
    const renderMenuItems = () => {
        if (loading) {
            return [
                {
                    key: 'loading',
                    label: (
                        <Flex justify="center" align="center" style={{ padding: '16px' }}>
                            <Spin tip="Đang tải thông báo..." />
                        </Flex>
                    ),
                    disabled: true,
                },
            ];
        }

        if (notifications.length === 0) {
            return [
                {
                    key: 'empty',
                    label: (
                        <Flex justify="center" align="center" style={{ padding: '16px' }}>
                            <Empty description="Không có thông báo" />
                        </Flex>
                    ),
                    disabled: true,
                },
            ];
        }

        return notifications;
    };

    return (
        <Dropdown
            className="admin-header-notification-button"
            rootClassName="admin-header-notification-menu"
            menu={{
                items: renderMenuItems(),
            }}
            trigger={['click']}
        >
            <Flex justify="center" align="center">
                    <Badge count={unreadCount} offset={[10, 0]}>
                        <BellOutlined style={{ fontSize: '20px' }} />
                    </Badge>
            </Flex>
        </Dropdown>
    );
};

export default Notification;