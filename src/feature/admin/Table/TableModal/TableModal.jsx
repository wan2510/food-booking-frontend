import React from "react";
import { Modal, Form } from "antd";
import TableForm from "./TableForm";

const TableModal = ({ visible, onClose, onSave, form, editingTable }) => {
    return (
        <Modal title={editingTable ? "Chỉnh sửa bàn" : "Thêm bàn"} open={visible} onCancel={onClose} onOk={onSave}>
            <TableForm form={form} editingTable={editingTable} />
        </Modal>
    );
};

export default TableModal;