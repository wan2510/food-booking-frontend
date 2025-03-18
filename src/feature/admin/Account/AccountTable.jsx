import React from 'react';
import { Table, Space, Button, Tag } from 'antd';

const AccountTable = ({ accounts, handleEdit, handleDelete }) => {
  const columns = [
    {
      title: <strong>ID</strong>,
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: <strong>Tên đầy đủ</strong>,
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: <strong>Số điện thoại</strong>,
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: <strong>Email</strong>,
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: <strong>Vai trò</strong>,
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: <strong>Ngày tạo</strong>,
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: <strong>Trạng thái</strong>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = "green"; // Mặc định là màu xanh cho "Kích hoạt"
        if (status === "Khóa") color = "red"; // Màu đỏ cho "Khóa"
        return <Tag color={color}>{status}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: <strong>Hành động</strong>,
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Thay đổi quyền/trạng thái
          </Button>
          {handleDelete && (
            <Button danger onClick={() => handleDelete(record.id)}>
              Xóa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="account-table"
      dataSource={accounts}
      columns={columns}
      rowKey="id"
      bordered
      pagination={{ pageSize: 5 }}
    />
  );
};

export default AccountTable;