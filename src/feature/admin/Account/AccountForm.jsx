import { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const AccountForm = ({ initialValues, onSubmit, isNew }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
        if (isNew) {
            form.resetFields();
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleFinish}
        >
            <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
                <Input disabled={!isNew} />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
            >
                <Input disabled={!isNew} />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                ]}
            >
                <Input disabled={!isNew} />
            </Form.Item>
            <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
                <Select disabled={!isNew}>
                    <Option value="admin">Admin</Option>
                    <Option value="user">Người dùng</Option>
                </Select>
            </Form.Item>
            <Form.Item name="status" label="Trạng thái">
                <Select>
                    <Option value="active">Kích hoạt</Option>
                    <Option value="inactive">Tạm dừng</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {isNew ? "Tạo tài khoản" : "Cập nhật"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountForm;
