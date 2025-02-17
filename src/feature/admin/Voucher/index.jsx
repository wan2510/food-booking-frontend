import React, { useState } from "react";
import { Modal, Form } from "antd";
import dayjs from "dayjs";

import ActionButtons from "./components/ActionButtons";
import VoucherTable from "./components/VoucherTable";
import VoucherForm from "./components/VoucherForm";

const Voucher = () => {
  // =================== STATE ===================
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      discount: "20",
      max_discount_value: "300",
      min_order_value: "100",
      expired_at: "19/2/2025",
      remain_quantity: "13",
      quantity: "30",
      create_at: "1/2/2025",
      status: "Còn hiệu lực",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // =================== HÀM MỞ MODAL ===================
  const showModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);

    if (voucher) {
      // Nếu sửa voucher, set giá trị lên form
      form.setFieldsValue({
        ...voucher,
        create_at: dayjs(voucher.create_at, "DD/MM/YYYY"),
        expired_at: dayjs(voucher.expired_at, "DD/MM/YYYY"),
      });
    } else {
      // Nếu thêm mới, reset form + set mặc định
      form.resetFields();
      form.setFieldsValue({
        status: "Còn hiệu lực",
        create_at: dayjs(),
        expired_at: dayjs(),
      });
    }
  };

  // =================== HÀM ĐÓNG MODAL ===================
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  // =================== HÀM LƯU DỮ LIỆU FORM ===================
  const handleSave = () => {
    form.validateFields().then((values) => {
      // Chuyển format ngày
      values.create_at = values.create_at.format("DD/MM/YYYY");
      values.expired_at = values.expired_at.format("DD/MM/YYYY");

      // Tự tính trạng thái dựa vào ngày
      values.status = dayjs(values.expired_at, "DD/MM/YYYY").isSame(dayjs())
        ? "Hết hiệu lực"
        : "Còn hiệu lực";

      if (editingVoucher) {
        // Cập nhật
        setVouchers((prev) =>
          prev.map((v) => (v.id === editingVoucher.id ? { ...v, ...values } : v))
        );
      } else {
        // Thêm mới
        setVouchers((prev) => [...prev, { id: Date.now(), ...values }]);
      }
      handleCancel();
    });
  };

  // =================== HÀM XÓA VOUCHER ===================
  const handleDelete = (id) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Voucher</h1>

      {/* Nút thêm voucher */}
      <ActionButtons onAdd={() => showModal()} />

      {/* Bảng hiển thị danh sách voucher */}
      <VoucherTable vouchers={vouchers} onEdit={showModal} onDelete={handleDelete} />

      {/* Modal form thêm/sửa voucher */}
      <Modal
        title={editingVoucher ? "Chỉnh sửa Voucher" : "Thêm Voucher"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <VoucherForm form={form} editingVoucher={editingVoucher} />
      </Modal>
    </div>
  );
};

export default Voucher;
