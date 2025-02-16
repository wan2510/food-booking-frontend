import React from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';

export const AddEditModal = ({
    mode,
    currentFood,
    handleCancel,
    handleSave,
}) => {
    const [form] = Form.useForm();

    // Điền dữ liệu hiện tại nếu có
    React.useEffect(() => {
        form.setFieldsValue({
            name: currentFood?.name || '',
            price: currentFood?.price || '',
            description: currentFood?.description || '',
        });
    }, [currentFood, form]);

    const onFinish = (values) => {
        handleSave(values);
    };

    return (
        <Modal
            title={mode === 'edit' ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
            visible={true}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: currentFood?.name,
                    price: currentFood?.price,
                    description: currentFood?.description,
                }}
            >
                <Form.Item
                    label="Tên món"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên món!' },
                    ]}
                >
                    <Input placeholder="Nhập tên món ăn" />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập giá món ăn!',
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Nhập giá món ăn"
                    />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} placeholder="Nhập mô tả món ăn" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 10 }}
                    >
                        Lưu
                    </Button>
                    <Button onClick={handleCancel}>Hủy</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
