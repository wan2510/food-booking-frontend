import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImagePicker from "../ImagePicker";

const AddEditModal = ({ visible, onCancel, onSave, editItem }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setImageUrl(null);
    }
  }, [visible, form]);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price ?? 0,
      });
      setImageUrl(editItem.imageUrl);
    }
  }, [editItem, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!imageUrl) {
        message.error("Vui lòng chọn hoặc tải lên ảnh!");
        return;
      }
      onSave({ ...values, imageUrl });
      form.resetFields();
      setImageUrl(null);
    } catch (error) {
      console.error("Lỗi khi validate form hoặc gửi yêu cầu:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title={editItem ? "Chỉnh Sửa Món" : "Thêm Món Mới Vào Danh Sách"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={editItem ? "Cập Nhật" : "Thêm món"}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ price: 0 }}
        requiredMark="optional"
      >
        <Form.Item
          label="Tên Món"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
        >
          <Input placeholder="Nhập tên món ăn" />
        </Form.Item>

        <Form.Item
          label="Mô Tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả món!" }]}
        >
          <Input placeholder="Nhập mô tả món ăn" />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá món!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá món ăn" />
        </Form.Item>

        <Form.Item label="Chọn Hình Ảnh">
          <div
            onClick={() => setShowImagePicker(true)}
            style={{
              width: 150,
              height: 150,
              border: "2px dashed #aaa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  console.log(`Không tải được ảnh: ${imageUrl}`);
                  e.target.src = "/images/default-food.jpg";
                }}
              />
            ) : (
              <PlusOutlined style={{ fontSize: 26, color: "#aaa" }} />
            )}
          </div>
        </Form.Item>

        <ImagePicker
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(image) => {
            setImageUrl(image);
            setShowImagePicker(false);
          }}
        />
      </Form>
    </Modal>
  );
};

export default AddEditModal;