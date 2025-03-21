import React from "react";
import { Modal, Form, Input, DatePicker, message } from "antd";

const CategoryModal = ({ open, onClose, onSave, initialValues }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values) => {
        onSave(values);
    };

    const validateUpdatedAt = (_, updatedAt) => {
        const createdAt = form.getFieldValue("created_at");
        if (!createdAt || !updatedAt) {
            return Promise.resolve(); // Không kiểm tra nếu thiếu một trong hai ngày
        }
        if (updatedAt.isAfter(createdAt)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Ngày cập nhật phải sau ngày tạo!"));
    };

    return (
        <Modal
            open={open}
            title={initialValues ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            okText="Lưu"
            cancelText="Hủy"
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Giới thiệu">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="created_at" label="Ngày tạo" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="updated_at"
                    label="Ngày cập nhật"
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày!" },
                        { validator: validateUpdatedAt }, // Thêm hàm xác thực ngày
                    ]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModal;