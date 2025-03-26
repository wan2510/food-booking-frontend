import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const AttendancePage = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/attendance', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAttendanceList(response.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 403) {
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const showModal = (attendance = null) => {
        setEditingAttendance(attendance);
        if (attendance) {
            form.setFieldsValue({
                userId: attendance.userId,
                checkIn: moment(attendance.checkIn),
                checkOut: attendance.checkOut ? moment(attendance.checkOut) : null,
                status: attendance.status,
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const token = localStorage.getItem('token');
            const data = {
                ...values,
                checkIn: values.checkIn.toISOString(),
                checkOut: values.checkOut ? values.checkOut.toISOString() : null,
            };

            if (editingAttendance) {
                await axios.put(`/api/attendance/${editingAttendance.id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                message.success('Cập nhật điểm danh thành công');
            } else {
                await axios.post('/api/attendance', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                message.success('Thêm điểm danh thành công');
            }
            setIsModalVisible(false);
            fetchAttendance();
        } catch (error) {
            handleError(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/attendance/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success('Xóa điểm danh thành công');
            fetchAttendance();
        } catch (error) {
            handleError(error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nhân viên',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 'Chưa check-out'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý điểm danh</h1>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
                Thêm điểm danh
            </Button>
            {/* Thanh tìm kiếm sử dụng Input */}
            <Input
                placeholder="Tìm kiếm theo tên nhân viên..."
                onChange={(e) => {
                    const searchText = e.target.value.toLowerCase();
                    const filtered = attendanceList.filter((item) =>
                        item.userName.toLowerCase().includes(searchText)
                    );
                    setAttendanceList(filtered);
                }}
                style={{ marginBottom: 16, width: 300 }}
            />
            <Table
                columns={columns}
                dataSource={attendanceList}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editingAttendance ? 'Sửa điểm danh' : 'Thêm điểm danh'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="userId"
                        label="Nhân viên"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                        <Select placeholder="Chọn nhân viên">
                            {/* Thêm danh sách nhân viên từ API nếu cần */}
                            <Select.Option value="user1">Nhân viên 1</Select.Option>
                            <Select.Option value="user2">Nhân viên 2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="checkIn"
                        label="Check-in"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian check-in' }]}
                    >
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="checkOut" label="Check-out">
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Select.Option value="PRESENT">Có mặt</Select.Option>
                            <Select.Option value="ABSENT">Vắng mặt</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AttendancePage;