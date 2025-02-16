import React, { useState } from 'react';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    InputNumber,
    Space,
    Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const Food = () => {
    const [foods, setFoods] = React.useState([
        { id: 1, name: 'Pizza', description: 'Delicious', price: 10 },
        { id: 2, name: 'Hamburger', description: 'Tasty', price: 5 },
        { id: 3, name: 'Hotdog', description: 'Yummy', price: 3 },
        { id: 4, name: 'Ice cream', description: 'Cool', price: 2 },
        { id: 5, name: 'Candy', description: 'Sweet', price: 1 },
        { id: 6, name: 'Donut', description: 'Soft', price: 1 },
        { id: 7, name: 'Cake', description: 'Moist', price: 5 },
        { id: 8, name: 'Cookie', description: 'Crunchy', price: 1 },
        { id: 9, name: 'Pie', description: 'Flaky', price: 3 },
        { id: 10, name: 'Pasta', description: 'Savory', price: 7 },
        { id: 11, name: 'Salad', description: 'Fresh', price: 6 },
        { id: 12, name: 'Soup', description: 'Hot', price: 4 },
        { id: 13, name: 'Sandwich', description: 'Filling', price: 5 },
        { id: 14, name: 'Taco', description: 'Spicy', price: 3 },
    ]);

    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [form] = Form.useForm();
    const [currentFood, setCurrentFood] = React.useState(null);

    const showModal = (food = null) => {
        setIsModalVisible(true);
        setCurrentFood(food);
        form.setFieldsValue(food || { name: '', price: '', description: '' });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (currentFood) {
                setFoods((prev) =>
                    prev.map((item) =>
                        item.id === currentFood.id
                            ? { ...item, ...values }
                            : item,
                    ),
                );
            } else {
                const newFood = { id: Date.now(), ...values };
                setFoods((prev) => [...prev, newFood]);
            }
            handleCancel();
        });
    };

    const handleDelete = (id) => {
        setFoods((prev) => prev.filter((item) => item.id !== id));
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price ($)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this food?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={() => showModal()}
            >
                Add Food
            </Button>
            <Table dataSource={foods} columns={columns} rowKey="id" bordered />

            <Modal
                title={currentFood ? 'Edit Food' : 'Add Food'}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the name!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter food name" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the price!',
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="Enter price"
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Food;
