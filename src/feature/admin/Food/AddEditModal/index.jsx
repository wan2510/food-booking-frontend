import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Rate } from 'antd';

const AddEditModal = ({ visible, onCancel, onSave, editItem }) => {
    const [form] = Form.useForm();
    const [rating, setRating] = useState(0); // State cho sao đánh giá

    // Khi modal mở, nếu là sửa món, điền thông tin vào form
    useEffect(() => {
        if (editItem) {
            form.setFieldsValue({
                name: editItem.name,
                description: editItem.description,
                price: editItem.price,
            });
            setRating(editItem.rating || 0); // Nếu có rating, set giá trị rating
        }
    }, [editItem, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSave({ ...values, rating }); // Thêm rating vào giá trị lưu
            form.resetFields();
        });
    };

    return (
        <Modal
            title={editItem ? 'Chỉnh Sửa Món' : 'Thêm Món'}
            visible={visible}
            onCancel={onCancel}
            onOk={handleOk}
            okText={editItem ? 'Cập Nhật' : 'Thêm'}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ price: 0, rating: 0 }}
            >
                <Form.Item
                    label="Tên Món"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên món!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô Tả"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả món!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giá món!' },
                    ]}
                >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Đánh giá">
                    <Rate value={rating} onChange={setRating} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditModal;
