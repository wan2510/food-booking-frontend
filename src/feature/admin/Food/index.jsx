import { Button, Form, Table } from 'antd';
import React, { useMemo } from 'react';
import { AddEditModal } from './AddEditModal';
import { createColumn } from './createColumn';

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

    const showModal = (record) => {
        setIsModalVisible(true);
        setCurrentFood(record);
        form.setFieldsValue(record);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentFood(null);
        form.resetFields();
    };
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (currentFood) {
                setFoods((prev) =>
                    prev.map((item) =>
                        item.key === currentFood.key
                            ? { ...item, ...values }
                            : item,
                    ),
                );
            } else {
                const newFood = { key: String(Date.now()), ...values };
                setFoods((prev) => [...prev, newFood]);
            }
            handleCancel();
        });
    };
    const handleDelete = (record) => {
        setFoods((prev) => prev.filter((item) => item.id !== record.id));
    };

    const columns = createColumn(showModal, handleDelete);

    return (
        <div>
            <Button
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 16 }}
                type="primary"
            >
                Add Food
            </Button>
            <Table dataSource={foods} columns={columns} />
            {isModalVisible && <AddEditModal mode={'add'} />}
            {isModalVisible && (
                <AddEditModal mode={'edit'} currentFood={currentFood} />
            )}
        </div>
    );
};

export default Food;
