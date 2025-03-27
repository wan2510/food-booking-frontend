import React from 'react';
import { Modal, Form } from 'antd';
import AccountForm from './AccountForm';

const AccountModal = ({ visible, onClose, onSave, form, editingAccount }) => {
    return (
        <Modal
            title={
                editingAccount
                    ? 'Chỉnh Sửa Tài Khoản'
                    : 'Tạo Tài Khoản Cho Nhân Viên'
            }
            open={visible}
            onCancel={onClose}
            onOk={onSave}
            okText="Đồng ý"
            cancelText="Hủy"
        >
            <AccountForm form={form} editingAccount={editingAccount} />
        </Modal>
    );
};

export default AccountModal;
