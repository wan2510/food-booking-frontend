import { Link } from 'react-router-dom';
import { Button, Space, Typography, message } from 'antd';
import { useSwipeable } from 'react-swipeable';
import moment from 'moment'; // Sử dụng moment để xử lý ngày

const { Text } = Typography;

export const BookingNotification = ({ notification, onMarkAsRead, onDelete }) => {
    // Hàm định dạng ngày từ chuỗi ISO
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    // Xử lý swipe để xóa
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            // Hiển thị thông báo xác nhận trước khi xóa
            message.warning({
                content: 'Bạn có chắc chắn muốn xóa thông báo này?',
                duration: 2,
                onClose: () => {
                    onDelete();
                    message.success('Đã xóa thông báo');
                },
            });
        },
        trackMouse: true,
    });

    // Kiểm tra notification có tồn tại không
    if (!notification) {
        return (
            <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                <Text type="secondary">Thông báo không hợp lệ</Text>
            </div>
        );
    }

    return (
        <div {...handlers} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
            <Link to={notification.actionUrl || '#'}>
                <Text strong>{notification.title || 'Không có tiêu đề'}</Text>
                <br />
                <Text>{notification.message || 'Không có nội dung'}</Text>
                <br />
                <Text type="secondary">{formatDate(notification.createdAt)}</Text>
            </Link>
            <Space style={{ marginTop: '8px' }}>
                {!notification.isRead && (
                    <Button size="small" onClick={onMarkAsRead}>
                        Đánh dấu đã đọc
                    </Button>
                )}
                <Button size="small" danger onClick={onDelete}>
                    Xóa
                </Button>
            </Space>
        </div>
    );
};

export default BookingNotification;