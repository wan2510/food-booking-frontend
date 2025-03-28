import React from 'react';
import { Table, Space, Button, Select, message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { updateAccount } from '../../../api/AccountApi';

const { Option } = Select;

// Component hiển thị bảng danh sách tài khoản
const AccountTable = ({ accounts, onUpdate, onEdit, loading }) => {
    // Định dạng ngày giờ
    const formatDateTime = (date) => {
        if (!date) return null;
        return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
    };

    // Thay đổi trạng thái hoặc vai trò trực tiếp trên bảng
    const handleFieldChange = async (record, field, value) => {
        if (record[field] === value) {
            message.info('Dữ liệu không thay đổi so với bản gốc!');
            return;
        }

        const updatedData = {
            uuid: record.uuid,
            fullName: record.fullName,
            email: record.email,
            hashPassword: record.hashPassword,
            phone: record.phone,
            role: field === 'role' ? value : record.role,
            status: field === 'status' ? value : record.status,
            createdAt: formatDateTime(record.createdAt),
            updatedAt: formatDateTime(record.updatedAt),
        };

        try {
            await updateAccount(updatedData);
            message.success(
                `Cập nhật ${field === 'status' ? 'trạng thái' : 'vai trò'} thành công!`,
            );
            onUpdate(); // Cập nhật bảng sau khi thành công
        } catch (error) {
            message.error(
                `Cập nhật ${field === 'status' ? 'trạng thái' : 'vai trò'} thất bại: ${error.message}`,
            );
            console.error('Lỗi khi cập nhật:', error);
        }
    };

    // Xóa mềm tài khoản (đặt status thành DELETED)
    const handleSoftDelete = async (record) => {
        if (record.status === 'DELETED') {
            message.info('Tài khoản đã bị xóa mềm trước đó!');
            return;
        }

        const updatedData = {
            uuid: record.uuid,
            fullName: record.fullName,
            email: record.email,
            hashPassword: record.hashPassword,
            phone: record.phone,
            role: record.role,
            status: 'DELETED',
            createdAt: formatDateTime(record.createdAt),
            updatedAt: formatDateTime(record.updatedAt),
        };

        try {
            await updateAccount(updatedData);
            message.success('Xóa mềm tài khoản thành công!');
            onUpdate(); // Cập nhật bảng sau khi thành công
        } catch (error) {
            message.error(`Xóa mềm tài khoản thất bại: ${error.message}`);
            console.error('Lỗi khi xóa mềm:', error);
        }
    };

    // Cấu hình các cột của bảng
    const columns = [
        {
            title: <strong>Email</strong>,
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
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
            title: <strong>Ngày Tạo</strong>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                let displayCreateAt;
                displayCreateAt = text
                    ? dayjs(text, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
                    : 'N/A';
                return displayCreateAt;
            },
            sorter: (a, b) =>
                dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: <strong>Vai trò</strong>,
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => (
                <Select
                    value={role}
                    style={{ width: 150 }}
                    onChange={(value) =>
                        handleFieldChange(record, 'role', value)
                    }
                >
                    <Option value="ROLE_USER">Người dùng</Option>
                    <Option value="ROLE_ADMIN">Quản trị viên</Option>
                    <Option value="ROLE_STAFF">Nhân viên</Option>
                    <Option value="ROLE_NEW_USER">Người dùng mới</Option>
                </Select>
            ),
            sorter: (a, b) => a.role.localeCompare(b.role),
        },
        {
            title: <strong>Trạng thái</strong>,
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 150 }}
                    onChange={(value) =>
                        handleFieldChange(record, 'status', value)
                    }
                >
                    <Option value="ACTIVE">Kích hoạt</Option>
                    <Option value="INACTIVE">Vô hiệu hóa</Option>
                </Select>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: <strong>Thao Tác</strong>,
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        className="edit-button"
                        onClick={() => onEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa tài khoản này không?"
                        onConfirm={() => handleSoftDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button className="delete-button">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={accounts}
            columns={columns}
            rowKey="uuid"
            bordered
            pagination={{ pageSize: 7 }}
            loading={loading}
        />
    );
};

export default AccountTable;