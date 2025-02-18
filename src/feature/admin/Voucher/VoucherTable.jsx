import React from "react";
import { Table, Space, Button, Tag, Popconfirm } from "antd";
import dayjs from "dayjs"; 

const VoucherTable = ({ vouchers, onEdit, onDelete }) => {
    const columns = [
        {
            title: "Mã Voucher",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Giảm giá (%)",
            dataIndex: "discount",
            key: "discount",
        },
        {
            title: "Giảm tối đa (kVNĐ)",
            dataIndex: "max_discount_value",
            key: "max_discount_value",
        },
        {
            title: "Mức tối thiểu (kVNĐ)",
            dataIndex: "min_order_value",
            key: "min_order_value",
        },
        {
            title: "Ngày tạo",
            dataIndex: "create_at",
            key: "create_at",
            render: (text) => {
                const formattedDate = dayjs(text);
                return formattedDate.isValid() ? formattedDate.format("DD/MM/YYYY") : "Invalid Date";
            },
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expired_at",
            key: "expired_at",
            render: (text) => {
                const formattedDate = dayjs(text);
                return formattedDate.isValid() ? formattedDate.format("DD/MM/YYYY") : "Invalid Date";
            },
        },        
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Còn lại",
            dataIndex: "remain_quantity",
            key: "remain_quantity",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color = status === "Khả dụng" ? "green" : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        Sửa
                    </Button>

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa không?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger>
                            Xóa
                        </Button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={vouchers}
            columns={columns}
            rowKey="id"
        />
    );
};

export default VoucherTable;
