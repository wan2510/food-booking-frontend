import { AppstoreOutlined } from '@ant-design/icons';

export const menuItems = [
    {
        key: 'manager',
        label: 'Quản lý',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: 'food-category',
                label: 'Danh mục thức ăn',
            },
            {
                key: 'food',
                label: 'Thức ăn',
            },
            {
                key: 'bill',
                label: 'Danh sách hóa đơn',
            },
        ],
    },
];
