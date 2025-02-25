import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const VoucherForm = ({ form, editingVoucher, onFinish }) => {
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
    }, [editingVoucher, form]);

    const validatePositiveNumber = (_, value) => {
        if (!value) {
            return Promise.reject("Vui lòng nhập số hợp lệ!");
        }
        if (!/^[0-9]+$/.test(value)) {
            return Promise.reject("Vui lòng nhập số nguyên dương!");
        }
        if (parseInt(value, 10) <= 0) {
            return Promise.reject("Giá trị phải lớn hơn 0!");
        }
        return Promise.resolve();
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
                name="discount"
                label="Giảm giá (%)"
                rules={[{ required: true, validator: validatePositiveNumber }]}
            >
                <Input placeholder="Nhập phần trăm giảm giá" />
            </Form.Item>

            <Form.Item
                name="max_discount_value"
                label="Giảm tối đa (kVNĐ)"
                rules={[{ required: true, validator: validatePositiveNumber }]}
            >
                <Input placeholder="Nhập giá giảm tối đa" />
            </Form.Item>

            <Form.Item
                name="min_order_value"
                label="Mức tối thiểu (kVNĐ)"
                rules={[{ required: true, validator: validatePositiveNumber }]}
            >
                <Input placeholder="Nhập giá tối thiểu" />
            </Form.Item>

            <Space style={{ display: "flex", width: "100%" }}>
                <Form.Item name="create_at" label="Ngày tạo" style={{ width: "100%" }}>
                    <DatePicker format="DD/MM/YYYY" disabled />
                </Form.Item>

                <Form.Item
                    name="expired_at"
                    label="Ngày hết hạn"
                    style={{ width: "100%" }}
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày hết hạn!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value.isBefore(getFieldValue("create_at"))) {
                                    return Promise.reject("Ngày hết hạn phải sau ngày tạo!");
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
                rules={[{ required: true, validator: validatePositiveNumber }]}
            >
                <Input placeholder="Nhập số lượng" disabled={!!editingVoucher} />
            </Form.Item>

            {editingVoucher && (
                <>
                    <Form.Item
                        name="remaining_quantity"
                        label="Số lượng còn lại"
                        rules={[{ required: true, validator: validatePositiveNumber }]}
                    >
                        <Input placeholder="Số lượng còn lại"/>
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Không khả dụng</Option>
                        </Select>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default VoucherForm;
