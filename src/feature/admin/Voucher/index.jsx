import { Table, Button, Modal, Form, Input, Select, Popconfirm, DatePicker, Space, Flex, Progress } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import React from 'react';
import dayjs from "dayjs";

const { Option } = Select;

const Voucher = () => {
    const [vouchers, setVouchers] = useState([
        { id: 1, discount: "20%", max_discount_value: "300k", min_order_value: "100k", expired_at: "19/2/2025", remain_quantity: "68%", create_at: "1/2/2025", status: "Active" },
        { id: 2, discount: "50%", max_discount_value: "100k", min_order_value: "300k", expired_at: "15/2/2025", remain_quantity: "100%", create_at: "15/2/2025", status: "Expired" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [form] = Form.useForm();

    const showModal = (voucher = null) => {
        setEditingVoucher(voucher);
        setIsModalOpen(true);
        if (voucher) {
            form.setFieldsValue(voucher);
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingVoucher(null);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingVoucher) {
                setVouchers((prev) =>
                    prev.map((v) => (v.id === editingVoucher.id ? { ...v, ...values } : v))
                );
            } else {
                const newVoucher = { id: Date.now(), ...values };
                setVouchers((prev) => [...prev, newVoucher]);
            }
            handleCancel();
        });
    };

    const handleDelete = (id) => {
        setVouchers((prev) => prev.filter((v) => v.id !== id));
    };

    const columns = [
        { title: "Mã Voucher", dataIndex: "id", key: "id" },
        { title: "Giảm giá", dataIndex: "discount", key: "discount" },
        { title: "Giảm tối đa", dataIndex: "max_discount_value", key: "max_discount_value" },
        { title: "Áp dụng cho đơn từ", dataIndex: "min_order_value", key: "min_order_value" },
        { title: "Ngày phát hành", dataIndex: "create_at", key: "create_at" },
        { title: "Ngày hết hạn", dataIndex: "expired_at", key: "expired_at" },
        {
            title: "Số lượng đã sử dụng",
            dataIndex: "remain_quantity",
            key: "remain_quantity",
            render: (remain_quantity) => (
                <Flex wrap gap="small">
                    <Progress percent={parseInt(remain_quantity)} status={parseInt(remain_quantity) === 100 ? "exception" : "active"} />
                </Flex>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span style={{ color: status === "Active" ? "green" : "red" }}>{status}</span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="default" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h1>Quản lý Voucher</h1>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Thêm Voucher
            </Button>
            <Table dataSource={vouchers} columns={columns} rowKey="id" />

            <Modal
                title={editingVoucher ? "Chỉnh sửa Voucher" : "Thêm Voucher"}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleSave}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item name="discount" label="Giảm giá" 
                        rules={[
                            { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                            { required: false, pattern: /^[1-9]\d*$/, message: "Chỉ nhập số có giá trị dương" }
                        ]}>
                        <Input placeholder="Nhập mức giảm tối đa" />
                    </Form.Item>
                    <Form.Item name="max_discount_value" label="Giảm tối đa" 
                        rules={[
                            { required: true, message: "Vui lòng nhập giá giảm tối đa" },
                            { required: false, pattern: /^[1-9]\d*$/, message: "Chỉ nhập số có giá trị dương" }
                            ]}>
                        <Input placeholder="Nhập mức giảm tối đa" />
                    </Form.Item>
                    <Form.Item name="min_order_value" label="Mức tối thiểu để áp dụng" 
                        rules={[
                            { required: true, message: "Vui lòng nhập giá tối thiểu để áp dụng" },
                            { required: false, pattern: /^[1-9]\d*$/, message: "Chỉ nhập số có giá trị dương" }
                            ]}>
                        <Input placeholder="Nhập giá tối thiểu để áp dụng" />
                    </Form.Item>
                    <Space style={{ display: "flex" }}>
                        <Form.Item
                            name="create_at"
                            label="Ngày tạo"
                            style={{ width: "100%" }}
                            rules={[{ required: true, message: "Vui lòng chọn ngày tạo" }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current < dayjs().startOf("day")}
                            />
                        </Form.Item>
                        <Form.Item
                            name="expired_at"
                            label="Ngày hết hạn"
                            style={{ width: "100%" }}
                            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value.isAfter(getFieldValue('create_at')) || value.isSame(getFieldValue('create_at'))) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Ngày hết hạn phải lớn hơn hoặc giống ngày tạo!'));
                                },
                            })]}
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                    </Space>
                    <Form.Item name="remain_quantity" label="Số lượng" 
                        rules={[
                            { required: true, message: "Vui lòng nhập số lượng voucher" },
                            { required: false, pattern: /^[1-9]\d*$/, message: "Chỉ nhập số có giá trị dương" }
                            ]}>
                        <Input placeholder="Nhập số lượng" />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true , message: "Vui"}]}>
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Active">Hoạt động</Option>
                            <Option value="Expired">Hết hạn</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default Voucher;
