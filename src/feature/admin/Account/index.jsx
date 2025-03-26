import React, { useState, useEffect } from 'react';
import AccountModals from './AccountModal/AccountModal';
import AccountTable from './AccountTable';
import './Account.css';
import { Button, message, Input, Empty } from 'antd';
import { getAccounts, createNewStaffAccount, updateAccount } from '../../../api/AccountApi';
const { Search } = Input;

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
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
  const [editId, setEditId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      const data = await getAccounts();
      setAccounts(data);
    };
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    try {
      if (editId) {
        const updatedData = { status: values.status, role: values.role || formData.role };
        await updateAccount(editId, updatedData);
        const updatedAccounts = accounts.map(account =>
          account.id === editId ? { ...account, ...updatedData } : account
        );
        setAccounts(updatedAccounts);
        setEditId(null);
        setIsEditModalOpen(false);
        message.success('Chỉnh sửa trạng thái tài khoản thành công!');
      } else {
        const newAccount = {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          password: values.password,
          status: values.status,
          role: values.role,
          createdDate: new Date().toLocaleDateString('vi-VN'),
          isLockedRole: true,
        };
        const createdAccount = await createNewStaffAccount(newAccount);
        setAccounts([...accounts, createdAccount]);
        setIsCreateModalOpen(false);
        message.success('Tạo tài khoản thành công!');
      }
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
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleEdit = (account) => {
    setEditId(account.id);
    setFormData({
      id: account.id,
      fullName: account.fullName,
      phone: account.phone,
      email: account.email,
      status: account.status,
      role: account.role,
      createdDate: account.createdDate,
      isLockedRole: account.isLockedRole,
    });
    setIsEditModalOpen(true);
  };

  const filteredAccounts = accounts.filter(account =>
    account.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="account-container">
      <h1>Quản lý Tài khoản</h1>
      <div className="action-buttons">
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Tạo tài khoản giành cho nhân viên
        </Button>
        <div className="search-container">
          <Search
            placeholder="Nhập tên tài khoản"
            onSearch={onSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      </div>
      <AccountTable
        accounts={filteredAccounts}
        handleEdit={handleEdit}
        handleDelete={null}
      />
      {filteredAccounts.length === 0 && (
        <div className="account-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
        </div>
      )}
      <AccountModals
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSubmit={handleSubmit}
        editId={editId}
        setEditId={setEditId}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
};

export default Account;