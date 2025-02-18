import React, { useState } from "react";
import { Table, Space, Button, Modal, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const FoodCategory = () => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [data, setData] = useState([
        { key: "1", ID: "1", name: "Đồ uống", description: "Các loại nước uống", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "2", ID: "2", name: "Món chính", description: "Các món ăn chính", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "3", ID: "3", name: "Món ăn vặt", description: "Đồ ăn nhẹ", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "4", ID: "4", name: "Tráng miệng", description: "Các món tráng miệng", created_at: "2025-02-15", updated_at: "2025-02-17" },
    ]);

    const columns = [
        { title: "ID", dataIndex: "ID", key: "ID" },
        { title: "Tên danh mục", dataIndex: "name", key: "name" },
        { title: "Giới thiệu", dataIndex: "description", key: "description" },
        { title: "Ngày tạo", dataIndex: "created_at", key: "created_at" },
        { title: "Ngày cập nhật", dataIndex: "updated_at", key: "updated_at" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.ID)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditingData(record);
        form.setFieldsValue({
            ...record,
            created_at: dayjs(record.created_at),
            updated_at: dayjs(record.updated_at),
        });
        setOpen(true);
    };

    const handleAddNew = () => {
        setEditingData(null);
        form.resetFields();
        setOpen(true);
    };


    const handleSave = (values) => {
        if (editingData) {

            const updatedData = data.map((item) =>
                item.ID === editingData.ID
                    ? {
                        ...item,
                        ...values,
                        created_at: values.created_at.format("YYYY-MM-DD"),
                        updated_at: values.updated_at.format("YYYY-MM-DD"),
                    }
                    : item
            );
            setData(updatedData);
        } else {

            const newItem = {
                ID: String(data.length + 1),
                key: String(data.length + 1),
                ...values,
                created_at: values.created_at.format("YYYY-MM-DD"),
                updated_at: values.updated_at.format("YYYY-MM-DD"),
            };
            setData([...data, newItem]);
        }

        setOpen(false);
    };

    
    const handleDelete = (id) => {
        setData(data.filter((item) => item.ID !== id));
    };

    return (
        <>
            <Button type="primary" onClick={handleAddNew} style={{ marginBottom: 16 }}>
                Thêm danh mục
            </Button>

            <Table columns={columns} dataSource={data} />

            <Modal
                open={open}
                title={editingData ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                okText="Lưu"
                cancelText="Hủy"
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Giới thiệu">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="created_at" label="Ngày tạo" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="updated_at" label="Ngày cập nhật" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FoodCategory;