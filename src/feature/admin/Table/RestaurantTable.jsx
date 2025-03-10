import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";

const RestaurantTable = ({ tables, onEdit, onDelete }) => {
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Số bàn", dataIndex: "number", key: "number" },
        { title: "Mô tả", dataIndex: "description", key: "description" },
        { title: "Số người tối đa", dataIndex: "max_number_human", key: "max_number_human" },
        { title: "Trạng thái", dataIndex: "status", key: "status", render: (status) => (status ? "Hoạt động" : "Không hoạt động") },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => onEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xoá?" onConfirm={() => onDelete(record.id)}>
                        <Button type="link" danger>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return <Table dataSource={tables} columns={columns} rowKey="id" />;
};

export default RestaurantTable;