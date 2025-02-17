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
                remain_quantity: editingVoucher.remain_quantity || editingVoucher.quantity,
            });
        } else {
            form.resetFields();
        }
    }, [editingVoucher]);

    const handleNumberInput = (value) => {
        if (value) {
            return parseInt(value, 10);
        }
        return value;
    };

    return (
        <Form layout="vertical" form={form}>
            <Form.Item
                name="discount"
                label="Giảm giá (%)"
                rules={[
                    { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                    { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số nguyên dương khác 0!" },
                ]}
            >
                <Input
                    placeholder="Nhập phần trăm giảm giá"
                    onBlur={(e) => form.setFieldsValue({ discount: handleNumberInput(e.target.value) })}
                />
            </Form.Item>

            <Form.Item
                name="max_discount_value"
                label="Giảm tối đa (kVNĐ)"
                rules={[
                    { required: true, message: "Vui lòng nhập giá giảm tối đa" },
                    { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số nguyên dương khác 0!" },
                ]}
            >
                <Input
                    placeholder="Nhập giá giảm tối đa"
                    onBlur={(e) => form.setFieldsValue({ max_discount_value: handleNumberInput(e.target.value) })}
                />
            </Form.Item>

            <Form.Item
                name="min_order_value"
                label="Mức tối thiểu (kVNĐ)"
                rules={[
                    { required: true, message: "Vui lòng nhập giá tối thiểu" },
                    { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số lớn hơn hoặc bằng 0!" },
                ]}
            >
                <Input
                    placeholder="Nhập giá tối thiểu"
                    onBlur={(e) => form.setFieldsValue({ min_order_value: handleNumberInput(e.target.value) })}
                />
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
                                if (value.isBefore(getFieldValue("create_at"))) {
                                    return Promise.reject(new Error("Ngày hết hạn phải sau ngày tạo!"));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
            </Space>

            <Form.Item
                name="quantity"
                label="Số lượng (lượt)"
                rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                    { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số nguyên dương khác 0!" },
                ]}
            >
                <Input
                    placeholder="Nhập số lượng"
                    onBlur={(e) => form.setFieldsValue({ quantity: handleNumberInput(e.target.value) })}
                />
            </Form.Item>
            {editingVoucher && (
                <Form.Item
                    name="quantity"
                    label="Số lượng (lượt)"
                    rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
                        { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số nguyên dương khác 0!" },
                    ]}
                >
                    <Input
                        placeholder="Nhập số lượng"
                        disabled
                        onBlur={(e) => form.setFieldsValue({ quantity: handleNumberInput(e.target.value) })}
                    />
                </Form.Item>
            )}

            {editingVoucher && (
                <Form.Item
                    name="remain_quantity"
                    label="Số lượng còn lại"
                    rules={[
                        { required: true, message: "Vui lòng nhập số lượng còn lại" },
                        { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số nguyên dương khác 0!" },
                    ]}
                >
                    <Input
                        placeholder="Số lượng còn lại"
                        value={form.getFieldValue("remain_quantity") || form.getFieldValue("quantity")}
                    />
                </Form.Item>
            )}

            {editingVoucher && (
                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Option value="Còn hiệu lực">Còn hiệu lực</Option>
                        <Option value="Hết hiệu lực">Hết hiệu lực</Option>
                    </Select>
                </Form.Item>
            )}
        </Form>
    );
};

export default VoucherForm;
