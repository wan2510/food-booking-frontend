import React from "react";
import { Table, Space, Button, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TABLE_STATUS_LABELS, TABLE_STATUS_COLORS } from "../../../constant/tableStatus";

const RestaurantTable = ({ tables, onEdit, onDelete, pagination, loading }) => {
    const columns = [
        { 
            title: "Số bàn", 
            dataIndex: "tableNumber", 
            key: "tableNumber",
            width: "10%",
            sorter: (a, b) => a.tableNumber.localeCompare(b.tableNumber)
        },
        { 
            title: "Mô tả", 
            dataIndex: "description", 
            key: "description",
            width: "40%",
            ellipsis: true,
        },
        { 
            title: "Sức chứa", 
            dataIndex: "capacity", 
            key: "capacity",
            width: "10%",
            sorter: (a, b) => a.capacity - b.capacity
        },
        { 
            title: "Trạng thái", 
            dataIndex: "status", 
            key: "status",
            width: "15%",
            render: (status) => (
                <Tag color={TABLE_STATUS_COLORS[status]} key={status}>
                    {TABLE_STATUS_LABELS[status]}
                </Tag>
            ),
            filters: Object.entries(TABLE_STATUS_LABELS).map(([key, label]) => ({
                text: label,
                value: key,
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Hành động",
            key: "action",
            width: "15%",
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => onEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm 
                        title="Xác nhận xoá bàn?" 
                        description={`Bạn có chắc chắn muốn xoá bàn ${record.tableNumber}?`}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xoá
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table 
            dataSource={tables} 
            columns={columns} 
            rowKey="id"
            pagination={pagination ? {
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng cộng ${total} bàn`
            } : false}
            loading={loading}
            size="middle"
        />
    );
};

export default RestaurantTable;