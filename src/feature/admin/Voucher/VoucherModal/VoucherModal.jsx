import React from "react";
import { Modal, Form } from "antd";
import VoucherForm from "./VoucherForm";

const VoucherModal = ({ visible, onClose, onSave, form, editingVoucher }) => {
  return (
    <Modal
      title={editingVoucher ? "Chỉnh Sửa Voucher" : "Thêm Voucher"} // Đổi thành tiếng Việt
      open={visible}
      onCancel={onClose}
      onOk={onSave}
      okText="Đồng ý" // Đổi nút OK thành "Đồng ý"
      cancelText="Hủy" // Đổi nút Cancel thành "Hủy"
    >
      <VoucherForm form={form} editingVoucher={editingVoucher} />
    </Modal>
  );
};

export default VoucherModal;