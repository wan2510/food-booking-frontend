import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const VoucherForm = ({ form, editingVoucher }) => {
    useEffect(() => {
        if (editingVoucher) {
            form.setFieldsValue({
                ...editingVoucher,
                create_at: editingVoucher.create_at ? dayjs(editingVoucher.create_at) : null,
                expired_at: editingVoucher.expired_at ? dayjs(editingVoucher.expired_at) : null,
            });
        } else {
            form.resetFields();
        }
    }, [editingVoucher]);

    const formatMoney = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleInputLimit = (field, max) => (e) => {
        let value = parseFloat(e.target.value.replace(/\./g, ""));
        if (isNaN(value) || value < 0) value = 0;
        if (value > max) value = max;
        form.setFieldsValue({ [field]: formatMoney(value) });
    };

    const handleCodeChange = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Chỉ cho phép chữ và số, tự động viết hoa
        form.setFieldsValue({ code: value });
    };

    return (
        <Form layout="vertical" form={form}>
            <Form.Item
                name="name"
                label="Tên Voucher"
                rules={[{ required: true, message: "Vui lòng nhập tên voucher" }]}
            >
                <Input placeholder="Nhập tên voucher" disabled={!!editingVoucher} />
            </Form.Item>

            <Form.Item
                name="code"
                label="Mã Voucher"
                rules={[
                    { required: true, message: "Vui lòng nhập mã voucher" },
                    { pattern: /^[A-Z0-9]+$/, message: "Mã chỉ được chứa chữ cái và số, không có khoảng trắng hoặc ký tự đặc biệt!" }
                ]}
            >
                <Input placeholder="Nhập mã voucher" disabled={!!editingVoucher} onChange={handleCodeChange} />
            </Form.Item>

            <Form.Item
                name="discount"
                label="Giảm giá (%)"
                rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm giá" }]}
            >
                <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    placeholder="Nhập phần trăm giảm giá"
                    onBlur={handleInputLimit("discount", 100)}
                />
            </Form.Item>

            <Form.Item
                name="max_discount_value"
                label="Giảm tối đa (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá giảm tối đa" }]}
            >
                <Input
                    type="text"
                    placeholder="Nhập giá giảm tối đa"
                    onBlur={handleInputLimit("max_discount_value", 10000000)}
                />
            </Form.Item>

            <Form.Item
                name="min_order_value"
                label="Mức tối thiểu (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá tối thiểu" }]}
            >
                <Input
                    type="text"
                    placeholder="Nhập giá tối thiểu"
                    onBlur={handleInputLimit("min_order_value", 10000000)}
                />
            </Form.Item>

            <Form.Item
                name="type"
                label="Loại Voucher"
                rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
            >
                <Select placeholder="Chọn loại voucher">
                    <Option value="cho người dùng">Cho người dùng</Option>
                    <Option value="cho người mới">Cho người mới</Option>
                    <Option value="cho khách vip">Cho khách VIP</Option>
                    <Option value="cho nhân viên">Cho nhân viên</Option>
                </Select>
            </Form.Item>

            <Space style={{ display: "flex", width: "100%" }}>
                <Form.Item
                    name="create_at"
                    label="Ngày tạo"
                    style={{ width: "100%" }}
                    rules={[{ required: true, message: "Vui lòng chọn ngày tạo" }]}
                >
                    <DatePicker format="DD/MM/YYYY" disabled />
                </Form.Item>

                <Form.Item
                    name="expired_at"
                    label="Ngày hết hạn"
                    style={{ width: "100%" }}
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày hết hạn" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value.isBefore(getFieldValue("create_at"))) {
                                    return Promise.reject(new Error("Ngày hết hạn phải sau ngày tạo!"));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <DatePicker format="DD/MM/YYYY" disabled={!!editingVoucher} />
                </Form.Item>
            </Space>

            {editingVoucher && (
                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Option value="Khả dụng">Khả dụng</Option>
                        <Option value="Không khả dụng">Không khả dụng</Option>
                    </Select>
                </Form.Item>
            )}
        </Form>
    );
};

export default VoucherForm;
