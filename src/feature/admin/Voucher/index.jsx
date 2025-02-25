import React, { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";

import VoucherModal from "./voucherModal/voucherModal";
import VoucherTable from "./voucherTable";
import ActionButtons from "./actionButtons";

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
      status: "Không khả dụng",
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

        values.quantity = parseInt(values.quantity, 10);

        if (editingVoucher) {
            values.remain_quantity = 
                values.remain_quantity !== undefined 
                    ? parseInt(values.remain_quantity, 10) 
                    : editingVoucher.remain_quantity;
        } else {
            values.remain_quantity = values.quantity;
        }

        const isExpired = dayjs(values.expired_at).endOf("day").isBefore(dayjs());
        const isOutOfStock = values.remain_quantity === 0;

        values.status = isExpired || isOutOfStock ? "Không khả dụng" : "Khả dụng";

        setVouchers((prev) =>
            editingVoucher
                ? prev.map((v) => (v.id === editingVoucher.id ? { ...v, ...values } : v))
                : [...prev, { id: Date.now(), ...values }]
        );

        handleCancel();
    });
};

  


  const handleUseVoucher = (id) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const newRemainQuantity = Math.max(0, v.remain_quantity - 1);
          const isOutOfStock = newRemainQuantity === 0;
          const isExpired = dayjs(v.expired_at).endOf("day").isBefore(dayjs());

          return {
            ...v,
            remain_quantity: newRemainQuantity,
            status: isExpired || isOutOfStock ? "Không khả dụng" : "Khả dụng",
          };
        }
        return v;
      })
    );
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
