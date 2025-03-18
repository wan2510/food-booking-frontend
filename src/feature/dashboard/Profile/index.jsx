import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserProfile.css';

const UserProfile = () => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            // Set dữ liệu vào form
            form.setFieldsValue({
                email: userData.email || '',
                fullName: userData.fullName || '',
                phone: userData.phone || ''
            });
        } else {
            message.error('Không tìm thấy thông tin người dùng');
        }
    }, [form]);

    return (
        <div className="user-profile-container">
            <Card title="Tài khoản của tôi" className="profile-card">
                <div className="profile-header">
                    <Avatar size={100} icon={<UserOutlined />} />
                    <h2>{user?.fullName}</h2>
                    <p>{user?.role}</p>
                </div>

                <Form form={form} layout="vertical">
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input disabled={!editing} />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input disabled={!editing} />
                    </Form.Item>

                    <div className="profile-actions">
                        <Button type="primary" onClick={() => setEditing(!editing)}>
                            {editing ? 'Lưu' : 'Chỉnh sửa thông tin'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default UserProfile;
