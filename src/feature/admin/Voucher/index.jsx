import React, { useState, useEffect, useCallback } from 'react';
import { message, Modal, Empty } from 'antd';
import dayjs from 'dayjs';
import VoucherModal from './VoucherModal/VoucherModal';
import VoucherTable from './VoucherTable';
import ActionButtons from './ActionButtons';
import { Form } from 'antd';
import {
    getVouchers,
    createVoucher,
    updateVoucher,
} from '../../../api/VoucherApi';
import './Voucher.css';

const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadVouchers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getVouchers();
            console.log('Danh sách voucher từ API:', data);
            setVouchers(data || []);
        } catch (error) {
            console.error('Lỗi khi tải voucher:', error);
            message.error('Không thể tải danh sách voucher!');
        } finally {
            setLoading(false);
        }
    }, []);

    const parseFormattedNumber = (value) => {
        if (!value) return 0;
        const cleanedValue = value.toString().replace(/[^0-9]/g, '');
        const parsedValue = parseInt(cleanedValue, 10);
        return isNaN(parsedValue) ? 0 : parsedValue;
    };

    useEffect(() => {
        loadVouchers();
    }, [loadVouchers]);

    const handleSearch = (text) => {
        console.log('Từ khóa tìm kiếm:', text);
        setSearchText(text);
    };

    // Hàm định dạng ngày giờ thành YYYY-MM-DDTHH:mm:ss
    const formatDateTime = (date) => {
        if (!date) return null;
        return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
    };

    const filteredVouchers = (vouchers || []).filter((voucher) => {
        const matchesSearchText = voucher.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesStatus = statusFilter
            ? voucher.status === statusFilter
            : true;
        const matchesType = typeFilter ? voucher.type === typeFilter : true;
        const matchesDeleted = !voucher.deletedAt; // Chỉ hiển thị voucher chưa bị xóa
        return matchesSearchText && matchesStatus && matchesType && matchesDeleted;
    });

    const showModal = (voucher = null) => {
        console.log('Mở modal với voucher:', voucher);
        setEditingVoucher(voucher);
        setIsModalOpen(true);
        if (voucher) {
            form.setFieldsValue({
                ...voucher,
                expiredAt: voucher.expiredAt ? dayjs(voucher.expiredAt) : null,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 'ACTIVE',
                expiredAt: dayjs()
                    .add(30, 'day')
                    .set('hour', 23)
                    .set('minute', 59)
                    .set('second', 59),
            });
        }
    };

    const handleCancel = () => {
        console.log('Đóng modal');
        setIsModalOpen(false);
        setEditingVoucher(null);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            if (editingVoucher) {
                // Nếu đang chỉnh sửa voucher
                const values = await form.validateFields();
                console.log('Dữ liệu từ form:', values);
                const cleanedValues = {
                    id: values.id,
                    name: editingVoucher.name, // Giữ nguyên name từ dữ liệu gốc
                    code: editingVoucher.code, // Giữ nguyên code từ dữ liệu gốc
                    discountPercentage: parseInt(values.discountPercentage, 10),
                    maxDiscountValue: parseFormattedNumber(values.maxDiscountValue),
                    minOrderValue: parseFormattedNumber(values.minOrderValue),
                    expiredAt: values.expiredAt ? formatDateTime(values.expiredAt) : null,
                    createdAt: editingVoucher.createdAt ? formatDateTime(editingVoucher.createdAt) : null,
                    updatedAt: formatDateTime(new Date()), // Cập nhật thời gian hiện tại
                    deletedAt: editingVoucher.deletedAt ? formatDateTime(editingVoucher.deletedAt) : null,
                    type: values.type,
                    status: values.status,
                };
                console.log('Dữ liệu sau khi xử lý (update):', cleanedValues);
                await updateVoucher(cleanedValues);
                message.success('Chỉnh sửa voucher thành công!');
            } else {
                // Nếu thêm mới voucher
                const values = await form.validateFields();
                console.log('Dữ liệu từ form:', values);
                const currentTime = formatDateTime(new Date());
                const cleanedValues = {
                    name: values.name,
                    code: values.code,
                    discountPercentage: parseInt(values.discountPercentage, 10),
                    maxDiscountValue: parseFormattedNumber(values.maxDiscountValue),
                    minOrderValue: parseFormattedNumber(values.minOrderValue),
                    expiredAt: values.expiredAt ? formatDateTime(values.expiredAt) : null,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                    deletedAt: null,
                    type: values.type,
                    status: 'ACTIVE',
                };
                console.log('Dữ liệu sau khi xử lý (create):', cleanedValues);
                await createVoucher(cleanedValues);
                message.success('Thêm voucher thành công!');
            }

            await loadVouchers();
            handleCancel();
        } catch (error) {
            console.error('Lỗi khi lưu voucher:', error);
            message.error('Lưu voucher thất bại!');
        }
    };

    return (
        <div className="voucher-container">
            <h1 className="voucher-title">Quản Lý Voucher</h1>
            <ActionButtons
                onAdd={() => showModal()}
                searchText={searchText}
                setSearchText={handleSearch}
                setStatusFilter={setStatusFilter}
                setTypeFilter={setTypeFilter}
            />
            <VoucherTable
                vouchers={filteredVouchers}
                onEdit={showModal}
                onUpdate={loadVouchers}
                loading={loading}
            />
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