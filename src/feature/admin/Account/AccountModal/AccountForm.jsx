import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const AccountForm = ({ form, editingAccount }) => {
    useEffect(() => {
        console.log('Account đang chỉnh sửa:', editingAccount);
        if (editingAccount) {
            form.setFieldsValue({
                uuid: editingAccount.uuid,
                email: editingAccount.email,
                hashPassword: editingAccount.hashPassword,
                fullName: editingAccount.fullName,
                phone: editingAccount.phone,
                status: editingAccount.status,
                role: editingAccount.role,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 'ACTIVE',
                role: 'ROLE_STAFF',
            });
        }
    }, [editingAccount, form]);

    return (
        <Form layout="vertical" form={form}>
            {/* Các trường ẩn */}
            <Form.Item name="uuid" hidden>
                <Input hidden />
            </Form.Item>
            <Form.Item name="role" hidden>
                <Input hidden />
            </Form.Item>
            <Form.Item name="status" hidden>
                <Input hidden />
            </Form.Item>
            {editingAccount && (
                <Form.Item name="hashPassword" hidden>
                    <Input hidden />
                </Form.Item>
            )}

            {/* Các trường hiển thị */}
            {!editingAccount && (
                <>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        name="hashPassword"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                min: 6,
                                message: 'Mật khẩu phải ít nhất 6 ký tự!',
                            },
                            {
                                pattern:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                message:
                                    'Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một số và một ký tự đặc biệt!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                </>
            )}
            <Form.Item
                name="fullName"
                label="Tên đầy đủ"
                rules={[
                    { required: true, message: 'Vui lòng nhập tên đầy đủ!' },
                ]}
            >
                <Input placeholder="Nhập tên đầy đủ" />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    {
                        pattern: /^[0-9]{10}$/,
                        message: 'Số điện thoại phải là 10 chữ số!',
                    },
                ]}
            >
                <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            {editingAccount && (
                <>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn trạng thái!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="ACTIVE">Kích hoạt</Option>
                            <Option value="INACTIVE">Vô hiệu hóa</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng inaugurated chọn vai trò!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="ROLE_NEW_USER">
                                Người dùng mới
                            </Option>
                            <Option value="ROLE_USER">Người dùng</Option>
                            <Option value="ROLE_STAFF">Nhân viên</Option>
                            <Option value="ROLE_ADMIN">Quản trị viên</Option>
                        </Select>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default AccountForm;
