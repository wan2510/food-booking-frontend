import React, { useState, useEffect, useCallback } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import AccountModal from './AccountModal/AccountModal';
import AccountTable from './AccountTable';
import ActionButtons from './ActionButtons';
import { Form } from 'antd';
import {
    getAccounts,
    createAccount,
    updateAccount,
} from '../../../api/AccountApi';
import './Account.css';

// Component chính để quản lý tài khoản
const Account = () => {
    const [accounts, setAccounts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [createdAtFilter, setCreatedAtFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [roleFilter, setRoleFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Hàm lấy data từ server
    const loadAccounts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAccounts();
            console.log('Data từ API:', data);
            setAccounts(data || []);
        } catch (error) {
            console.error('Lỗi khi tải voucher:', error);
            message.error('Không thể tải danh sách tài khoản!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Gọi hàm loadAccounts khi component được tạo
    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    // So sánh 2 ngày có cùng ngày không
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return dayjs(date1).isSame(dayjs(date2), 'day');
    };

    // Lọc danh sách tài khoản theo tên, ngày tạo, vai trò và trạng thái ACTIVE
    const filteredAccounts = (accounts || []).filter((account) => {
        const matchesSearchText = account.fullName
            ? account.fullName.toLowerCase().includes(searchText.toLowerCase())
            : false;
        const matchesStatus = statusFilter
            ? account.status === statusFilter
            : true;
        const matchesRole = roleFilter ? account.role === roleFilter : true;
        const matchesCreatedAt = createdAtFilter
            ? isSameDay(account.createdAt, createdAtFilter)
            : true;
        return (
            matchesSearchText &&
            matchesCreatedAt &&
            matchesRole &&
            matchesStatus
        );
    });

    // Mở modal để tạo hoặc chỉnh sửa tài khoản
    const showModal = (account = null) => {
        console.log('Mở modal với account:', account);
        setEditingAccount(account);
        setIsModalOpen(true);
        if (account) {
            form.setFieldsValue({
                ...account,
                createdAt: account.createdAt ? dayjs(account.createdAt) : null,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 'ACTIVE',
                role: 'ROLE_STAFF',
            });
        }
    };

    // Đóng modal
    const handleCancel = () => {
        console.log('Đóng modal');
        setIsModalOpen(false);
        setEditingAccount(null);
        form.resetFields();
    };

    // Lưu data (tạo mới hoặc cập nhật)
    const handleSave = async () => {
        try {
            if (editingAccount) {
                // Nếu đang chỉnh sửa
                const values = await form.validateFields();
                console.log('Data nhận:', values);
                const cleanedValues = {
                    uuid: values.uuid,
                    email: editingAccount.email,
                    fullName: values.fullName,
                    phone: values.phone,
                    status: values.status,
                    role: values.role,
                };
                console.log('Data sau khi xử lý (update):', cleanedValues);
                await updateAccount(cleanedValues);
                message.success('Chỉnh sửa thành công!');
            } else {
                // Nếu tạo mới
                const values = await form.validateFields();
                console.log('Data nhận:', values);
                const cleanedValues = {
                    email: values.email,
                    hashPassword: values.hashPassword,
                    fullName: values.fullName,
                    phone: values.phone,
                    role: values.role,
                    status: values.status,
                };
                console.log('Data sau khi xử lý (create):', cleanedValues);
                await createAccount(cleanedValues);
                message.success('Tạo mới thành công!');
            }
            await loadAccounts();
            handleCancel();
        } catch (error) {
            console.error('Lỗi khi lưu data:', error);
            message.error('Lưu dứ liệu thất bại!');
        }
    };

    return (
        <div className="account-container">
            <h1 className="account-title">Quản Lý Tài Khoản</h1>
            <ActionButtons
                onAdd={() => showModal()}
                searchText={searchText}
                setSearchText={setSearchText}
                setCreatedAtFilter={setCreatedAtFilter}
                setRoleFilter={setRoleFilter}
                setStatusFilter={setStatusFilter}
            />
            <AccountTable
                accounts={filteredAccounts}
                setAccounts={setAccounts}
                onEdit={showModal}
                loading={loading}
            />
            <AccountModal
                visible={isModalOpen}
                onClose={handleCancel}
                onSave={handleSave}
                form={form}
                editingAccount={editingAccount}
            />
        </div>
    );
};

export default Account;
