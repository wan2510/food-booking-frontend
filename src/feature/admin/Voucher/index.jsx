import React, { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";

import VoucherModal from "./VoucherModal/VoucherModal";
import VoucherTable from "./VoucherTable";
import ActionButtons from "./ActionButtons";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      discount: "20",
      max_discount_value: "300",
      min_order_value: "100",
      expired_at: dayjs("19/02/2025", "DD/MM/YYYY").toISOString(),
      remain_quantity: "13",
      quantity: "30",
      create_at: dayjs("01/02/2025", "DD/MM/YYYY").toISOString(),
      status: "Còn hiệu lực",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  const showModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);

    if (voucher) {
      form.setFieldsValue({
        ...voucher,
        create_at: dayjs(voucher.create_at),
        expired_at: dayjs(voucher.expired_at),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: "Còn hiệu lực",
        create_at: dayjs(),
        expired_at: dayjs(),
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      values.create_at = values.create_at.toISOString();
      values.expired_at = values.expired_at.toISOString();
      values.status = dayjs(values.expired_at).endOf("day").isBefore(dayjs()) ? "Hết hiệu lực" : "Còn hiệu lực";
      values.remain_quantity = values.quantity;

      if (editingVoucher) {
        setVouchers((prev) =>
          prev.map((v) => (v.id === editingVoucher.id ? { ...v, ...values } : v))
        );
      } else {
        setVouchers((prev) => [...prev, { id: Date.now(), ...values }]);
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Voucher</h1>

      <ActionButtons onAdd={() => showModal()} />

      <VoucherTable vouchers={vouchers} onEdit={showModal} onDelete={handleDelete} />

      <VoucherModal
        visible={isModalOpen}
        onClose={handleCancel}
        onSave={handleSave}
        form={form}
        editingVoucher={editingVoucher}
      />
    </div>
  );
};

export default Voucher;
