import React, { useState } from "react";
import { Table, Space, Button, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CategoryModal from "./FoodCategory";

const FoodCategory = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([
        { key: "1", ID: "1", name: "Đồ uống", description: "Các loại nước uống", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "2", ID: "2", name: "Món chính", description: "Các món ăn chính", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "3", ID: "3", name: "Món ăn vặt", description: "Đồ ăn nhẹ", created_at: "2025-02-15", updated_at: "2025-02-17" },
        { key: "4", ID: "4", name: "Tráng miệng", description: "Các món tráng miệng", created_at: "2025-02-15", updated_at: "2025-02-17" },
    ]);

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText)
    );

    const handleEdit = (record) => {
        setEditingData({
            ...record,
            created_at: dayjs(record.created_at),
            updated_at: dayjs(record.updated_at),
        });
        setOpenModal(true);
    };

    const handleAddNew = () => {
        setEditingData(null);
        setOpenModal(true);
    };

    const handleSave = (values) => {
        if (editingData) {
            setData((prevData) => prevData.map((item) => (item.ID === editingData.ID ? { ...values, ID: editingData.ID, key: editingData.key } : item)));
        } else {
            const newID = (data.length + 1).toString();
            setData([...data, { ...values, ID: newID, key: newID }]);
        }
        setOpenModal(false);
    };

    const handleDelete = (id) => {
        setData(data.filter((item) => item.ID !== id));
    };

    const columns = [
        { title: "ID", dataIndex: "ID", key: "ID" },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            filters: [
                { text: "Đồ uống", value: "Đồ uống" },
                { text: "Món chính", value: "Món chính" },
                { text: "Tráng miệng", value: "Tráng miệng" },
            ],
            onFilter: (value, record) => record.name.includes(value),
        },
        { title: "Giới thiệu", dataIndex: "description", key: "description" },
        { title: "Ngày tạo", dataIndex: "created_at", key: "created_at" },
        { title: "Ngày cập nhật", dataIndex: "updated_at", key: "updated_at" },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.ID)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    style={{ fontSize: "18px", padding: "12px 24px", height: "50px", borderRadius: "8px" }}
                >
                    Thêm danh mục
                </Button>
                <Input.Search
                    placeholder="Tìm kiếm danh mục..."
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
            />

            <CategoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleSave}
                initialValues={editingData} 
            />
        </>
    );
};

export default FoodCategory;
