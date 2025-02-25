import React from "react";
import { Modal, Form } from "antd";
import VoucherForm from "./voucherForm";

const VoucherModal = ({ visible, onClose, onSave, form, editingVoucher }) => {
  return (
    <Modal
      title={editingVoucher ? "Chỉnh sửa Voucher" : "Thêm Voucher"}
      open={visible}
      onCancel={onClose}
      onOk={onSave}
    >
      <VoucherForm form={form} editingVoucher={editingVoucher} />
    </Modal>
  );
};

export default VoucherModal;
