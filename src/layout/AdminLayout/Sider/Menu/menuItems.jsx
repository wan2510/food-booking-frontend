import { AppstoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React from "react";

export const menuItems = [
    {
        key: 'manager',
        label: 'Quản lý',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: '/admin/food',
                label: <Link to="/admin/food">Thức ăn</Link>,
            },
            {
                key: '/admin/food-category',
                label: <Link to="/admin/food-category">Danh mục thức ăn</Link>,
            },
            {

                key: 'bill',
                label: 'Danh sách hóa đơn',
            },

                key: '/admin/table',
                label: <Link to="/admin/table">Bàn</Link>,
            },
            {
                key: '/admin/voucher',
                label: <Link to="/admin/voucher">Voucher</Link>,
            },
            {
                key: '/admin/account',
                label: <Link to="/admin/account">Account</Link>,
            },
            {
                key: '/admin/revenue',
                label: <Link to="/admin/revenue">Doanh thu</Link>,
            },


        ],
    },
];
