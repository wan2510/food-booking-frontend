import { AppstoreOutlined } from '@ant-design/icons';
import React from "react";

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
        ],
    },
];
