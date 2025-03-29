import { AppstoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React from 'react';

export const menuItems = [
    {
        key: 'manager',
        label: 'Quản lý',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: '/admin/order',
                label: <Link to="/admin/order">Gọi món</Link>,
            },
            {
                key: '/admin/table',
                label: <Link to="/admin/table">Quản lý bàn</Link>,
            },
            {
                key: '/admin/voucher',
                label: <Link to="/admin/voucher">Quản lý mã giảm giá</Link>,
            },
            {
                key: '/admin/account',
                label: <Link to="/admin/account">Quản lý tài khoản</Link>,
            },
            {
                key: 'bill',
                label: <Link to="/admin/bill">Danh sách hóa đơn</Link>,
            },
            {
                key: '/admin/revenue',
                label: <Link to="/admin/revenue">Doanh thu</Link>,
            },
            {
                key: '/admin/food',
                label: <Link to="/admin/food"> Quản lý sản phẩm</Link>,
            },
            {
                key: '/admin/food-category',
                label: <Link to="/admin/food-category">Danh mục sản phẩm</Link>,
            },
        ],
    },
];
