import React from 'react';
import { Table, Space, Button, Tag } from 'antd';
import dayjs from 'dayjs';

const VoucherTable = ({ vouchers, onEdit }) => {
    const columns = [
        {
            title: <strong>Mã Voucher</strong>,
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: <strong>Tên Voucher</strong>,
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: <strong>Giảm giá (%)</strong>,
            dataIndex: 'discount',
            key: 'discount',
            sorter: (a, b) => Number(a.discount) - Number(b.discount),
        },
        {
            title: <strong>Giảm tối đa (kVNĐ)</strong>,
            dataIndex: 'max_discount_value',
            key: 'max_discount_value',
            sorter: (a, b) =>
                Number(a.max_discount_value) - Number(b.max_discount_value),
        },
        {
            title: <strong>Mức tối thiểu (kVNĐ)</strong>,
            dataIndex: 'min_order_value',
            key: 'min_order_value',
            sorter: (a, b) =>
                Number(a.min_order_value) - Number(b.min_order_value),
        },
        {
            title: <strong>Ngày tạo</strong>,
            dataIndex: 'create_at',
            key: 'create_at',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
            sorter: (a, b) =>
                dayjs(a.create_at).unix() - dayjs(b.create_at).unix(),
        },
        {
            title: <strong>Ngày hết hạn</strong>,
            dataIndex: 'expired_at',
            key: 'expired_at',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
            sorter: (a, b) =>
                dayjs(a.expired_at).unix() - dayjs(b.expired_at).unix(),
        },
        {
            title: <strong>Loại</strong>,
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: <strong>Trạng thái</strong>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const color = status === 'Khả dụng' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: <strong>Thao tác</strong>,
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];
    return (
        <Table
            dataSource={vouchers}
            columns={columns}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
        />
    );
};
export default VoucherTable;
