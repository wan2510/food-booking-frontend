import React, { useEffect } from "react";
import { Form, Input, InputNumber, Switch } from "antd";

const TableForm = ({ form, editingTable }) => {
    useEffect(() => {
        if (editingTable) {
            form.setFieldsValue(editingTable);
        }
    }, [editingTable, form]);

    return (
        <Form form={form} layout="vertical">
            <Form.Item name="number" label="Số bàn" rules={[{ required: true, message: "Vui lòng nhập số bàn!" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="max_number_human" label="Số người tối đa" rules={[{ required: true, message: "Vui lòng nhập số người tối đa!" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>
    );
};

export default TableForm;