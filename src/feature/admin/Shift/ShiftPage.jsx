import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Tabs } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

const ShiftPage = () => {
    const [shiftList, setShiftList] = useState([]);
    const [historyShifts, setHistoryShifts] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentShift, setCurrentShift] = useState(null);
    const [form] = Form.useForm();
    const [monthForm] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaff();
        fetchShifts();
    }, []);

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/users/staff', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStaffList(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchShifts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/shifts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShiftList(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchShiftsByMonth = async (month, year) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/shifts/by-month', {
                params: { month, year },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHistoryShifts(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy lịch sử ca làm việc!');
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

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            message.success('Đăng xuất thành công!');
            navigate('/login');
        } catch (error) {
            message.error('Đăng xuất thất bại!');
        }
    };

    const showModal = () => {
        setIsEditing(false);
        setCurrentShift(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setCurrentShift(record);
        form.setFieldsValue({
            name: record.name,
            date: record.date ? dayjs(record.date) : null,
            startTime: record.startTime ? dayjs(record.startTime, 'HH:mm:ss') : null,
            endTime: record.endTime ? dayjs(record.endTime, 'HH:mm:ss') : null,
            staffId: record.staffId,
            status: record.status,
            note: record.note,
        });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.date = values.date ? values.date.format('YYYY-MM-DD') : null;
            values.startTime = values.startTime ? values.startTime.format('HH:mm:ss') : null;
            values.endTime = values.endTime ? values.endTime.format('HH:mm:ss') : null;
            const token = localStorage.getItem('token');

            if (isEditing) {
                await axios.put(`/api/shifts/${currentShift.id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                message.success('Cập nhật ca làm việc thành công!');
            } else {
                await axios.post('/api/shifts', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                message.success('Thêm ca làm việc thành công!');
            }

            setIsModalOpen(false);
            form.resetFields();
            fetchShifts();
        } catch (error) {
            message.error(isEditing ? 'Lỗi khi cập nhật ca làm việc!' : 'Lỗi khi thêm ca làm việc!');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentShift(null);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/shifts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success('Xóa ca làm việc thành công!');
            fetchShifts();
        } catch (error) {
            message.error('Lỗi khi xóa ca làm việc!');
        }
    };

    const handleSearchByMonth = async () => {
        const values = await monthForm.validateFields();
        const month = values.monthYear.month() + 1;
        const year = values.monthYear.year();
        fetchShiftsByMonth(month, year);
    };

    const columns = [
        { title: 'Tên ca', dataIndex: 'name', key: 'name' },
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Giờ bắt đầu', dataIndex: 'startTime', key: 'startTime' },
        { title: 'Giờ kết thúc', dataIndex: 'endTime', key: 'endTime' },
        { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    const historyColumns = [
        { title: 'Tên ca', dataIndex: 'name', key: 'name' },
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Giờ bắt đầu', dataIndex: 'startTime', key: 'startTime' },
        { title: 'Giờ kết thúc', dataIndex: 'endTime', key: 'endTime' },
        { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý ca làm việc</h2>
                <Button type="primary" danger onClick={handleLogout}>
                    Đăng xuất
                </Button>
            </div>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Ca làm việc hiện tại" key="1">
                    <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                        Thêm ca làm việc
                    </Button>
                    <Table dataSource={shiftList} columns={columns} rowKey="id" />
                </TabPane>

                <TabPane tab="Lịch sử ca làm việc" key="2">
                    <Form form={monthForm} layout="inline" onFinish={handleSearchByMonth} style={{ marginBottom: 16 }}>
                        <Form.Item
                            name="monthYear"
                            label="Chọn tháng"
                            rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
                        >
                            <DatePicker.MonthPicker style={{ width: 200 }} format="MM/YYYY" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                    <Table dataSource={historyShifts} columns={historyColumns} rowKey="id" />
                </TabPane>
            </Tabs>

            <Modal
                title={isEditing ? 'Sửa ca làm việc' : 'Thêm ca làm việc'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên ca"
                        rules={[{ required: true, message: 'Vui lòng nhập tên ca!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="startTime"
                        label="Giờ bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
                    >
                        <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        name="endTime"
                        label="Giờ kết thúc"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}
                    >
                        <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        name="staffId"
                        label="Nhân viên phụ trách"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                    >
                        <Select>
                            {staffList.map(staff => (
                                <Option key={staff.uuid} value={staff.uuid}>{staff.fullName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Option value="ASSIGNED">Đã phân công</Option>
                            <Option value="COMPLETED">Hoàn thành</Option>
                            <Option value="CANCELLED">Hủy</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShiftPage;