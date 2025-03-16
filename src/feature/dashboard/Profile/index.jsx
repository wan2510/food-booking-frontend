import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserProfile.css';

const UserProfile = () => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                message.error('Bạn cần đăng nhập để xem thông tin tài khoản');
                return;
            }
    
            const response = await fetch('http://localhost:8080/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                form.setFieldsValue({
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address || '',
                });
            } else {
                message.error('Không thể tải thông tin người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin người dùng:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };    
    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('accessToken');
    
            if (!token) {
                message.error('Bạn cần đăng nhập để cập nhật thông tin tài khoản');
                return;
            }
    
            const response = await fetch('http://localhost:8080/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: values.fullName,
                    phone: values.phone,
                    address: values.address
                })
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                message.success('Cập nhật thông tin thành công');
                setEditing(false);
            } else {
                message.error('Không thể cập nhật thông tin người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            message.error('Đã xảy ra lỗi khi cập nhật thông tin người dùng');
        }
    };
    

    return (
        <div className="user-profile-container">
            <Card title="Tài khoản của tôi" className="profile-card">
                <div className="profile-header">
                    <Avatar size={100} icon={<UserOutlined />} src={user?.avatarUrl} />
                    <h2>{user?.fullName}</h2>
                    <p>{user?.role}</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        fullName: user?.fullName || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        address: user?.address || '',
                    }}
                >
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

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input disabled={!editing} />
                    </Form.Item>

                    <div className="profile-actions">
                        {editing ? (
                            <>
                                <Button type="primary" htmlType="submit">
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={() => setEditing(false)}>
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => setEditing(true)}>
                                Chỉnh sửa thông tin
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default UserProfile; 