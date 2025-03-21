import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const AccountForm = ({ formData, handleInputChange, handleSelectChange, handleSubmit, editId, isModalOpen, onClose, validateOnMount }) => {
  const [form] = Form.useForm();
  const isRoleLocked = formData.isLockedRole;

  useEffect(() => {
    form.resetFields();
    if (editId) {
      form.setFieldsValue({
        status: formData.status,
        role: formData.role,
      });
    } else {
      form.setFieldsValue({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        role: formData.role,
      });
    }
  }, [form, editId, formData, isModalOpen]);

  const onFinish = (values) => {
    handleSubmit({
      ...(editId ? { status: values.status, role: values.role || formData.role } : values),
    });
    if (!editId) {
      form.resetFields(); // Reset form khi tạo mới
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        role: formData.role,
      }}
      onFinish={onFinish}
      validateTrigger={['onSubmit']} // Chỉ validate khi submit
    >
      {!editId && (
        <>
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ!' }]}
          >
            <Input placeholder="Tên đầy đủ" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        </>
      )}

      <Form.Item
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select onChange={(value) => handleSelectChange('status', value)}>
          <Option value="Kích hoạt">Kích hoạt</Option>
          <Option value="Vô hiệu hóa">Vô hiệu hóa</Option>
        </Select>
      </Form.Item>

      <Form.Item name="role">
        {isRoleLocked ? (
          <Input value={formData.role} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
        ) : (
          <Select onChange={(value) => handleSelectChange('role', value)}>
            <Option value="Người mới">Người mới</Option>
            <Option value="VIP">VIP</Option>
            <Option value="Người dùng">Người dùng</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editId ? 'Cập nhật' : 'Tạo tài khoản'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onClose}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;