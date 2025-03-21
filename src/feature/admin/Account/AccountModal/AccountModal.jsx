import React from 'react';
import { Modal } from 'antd';
import AccountForm from './AccountForm';

const AccountModals = ({
  formData,
  setFormData,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  editId,
  setEditId,
  isCreateModalOpen,
  setIsCreateModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  return (
    <>
      <Modal
        title="Tạo tài khoản cho nhân viên"
        visible={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setFormData({
            id: null,
            fullName: '',
            phone: '',
            email: '',
            password: '',
            status: 'Kích hoạt',
            role: 'Staff',
            createdDate: '',
            isLockedRole: true,
          });
        }}
        footer={null}
      >
        <AccountForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          editId={editId}
          isModalOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          validateOnMount={false}
        />
      </Modal>

      <Modal
        title="Chỉnh sửa trạng thái tài khoản"
        visible={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditId(null);
        }}
        footer={null}
      >
        <AccountForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          editId={editId}
          isModalOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditId(null);
          }}
          validateOnMount={false}
        />
      </Modal>
    </>
  );
};

export default AccountModals;