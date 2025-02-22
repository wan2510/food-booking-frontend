import React, { useState } from 'react';
import { Button, Table, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddEditModal from './AddEditModal'; // Import đúng
import { createColumns } from './createColumn';

const Food = () => {
    const [foods, setFoods] = useState([
        {
            id: 1,
            name: 'Pizza',
            description: 'Delicious',
            price: 10,
            rating: 4,
        },
        { id: 2, name: 'Hamburger', description: 'Tasty', price: 5, rating: 3 },
        { id: 3, name: 'Hotdog', description: 'Yummy', price: 3, rating: 2 },
        { id: 4, name: 'Ice cream', description: 'Cool', price: 2, rating: 5 },
        { id: 5, name: 'Candy', description: 'Sweet', price: 1, rating: 3 },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [searchText, setSearchText] = useState('');

    const handleEdit = (item) => {
        setEditItem(item);
        setIsModalVisible(true);
    };

    const handleAddClick = () => {
        setEditItem(null);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (newData) => {
        if (editItem) {
            setFoods(
                foods.map((item) => (item.id === editItem.id ? newData : item)),
            );
        } else {
            setFoods([...foods, { ...newData, id: Date.now() }]);
        }
        setIsModalVisible(false);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleDelete = (record) => {
        setFoods(foods.filter((food) => food.id !== record.id));
    };

    const filteredFoods = foods.filter(
        (food) =>
            food.name.toLowerCase().includes(searchText.toLowerCase()) ||
            food.description.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddClick}
                    >
                        Thêm Món
                    </Button>
                </Col>

                <Col>
                    <Input.Search
                        placeholder="Tìm món ăn..."
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>

            <Table
                columns={createColumns(handleEdit, handleDelete)} // Sử dụng hàm createColumns với handleDelete
                dataSource={filteredFoods}
                rowKey="id"
            />

            <AddEditModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSave={handleSave}
                editItem={editItem}
            />
        </div>
    );
};

export default Food;
