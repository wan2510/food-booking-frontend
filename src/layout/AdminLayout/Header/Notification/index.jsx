import { BellOutlined, CalendarOutlined } from '@ant-design/icons';
import { Dropdown, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { BookingNotification } from './BookingNotification';
import './notification.css';

export const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const notificaitonData = [
            {
                customerName: 'Nguyen Van A',
                type: 'booking',
                phone: '1111111',
            },
        ];

        const notificationItems = notificaitonData.map((data, index) => ({
            key: index,
            label: <BookingNotification bookingName={data.customerName} />,
            icon: <CalendarOutlined />,
        }));

        setNotifications(notificationItems);
    }, []);

    return (
        <Dropdown
            className="admin-header-notification-button"
            rootClassName="admin-header-notification-menu"
            menu={{
                items: notifications,
            }}
            trigger={'click'}
        >
            <Flex justify="center" align="center">
                <BellOutlined />
            </Flex>
        </Dropdown>
    );
};
