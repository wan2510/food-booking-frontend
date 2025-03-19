import React from "react";
import { Modal, Form } from "antd";
import TableForm from "./TableForm";


const TableModal = ({ visible, onClose, onSave, form, editingTable, loading }) => {
    return (
        <Modal 
            title={editingTable ? "Chỉnh sửa bàn" : "Thêm bàn mới"} 
            open={visible} 
            onCancel={onClose} 
            onOk={onSave}
            confirmLoading={loading}
            okText={editingTable ? "Cập nhật" : "Thêm"}
            cancelText="Huỷ"
            maskClosable={false}
            destroyOnClose
            width={500}
        >
            <TableForm form={form} editingTable={editingTable} />
        </Modal>
    );
};

export default TableModal;