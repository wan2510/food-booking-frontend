// src/feature/dashboard/Voucher/Voucher.js
import React, { useState, useEffect, useCallback } from "react";
import { message, Modal, Empty } from "antd";
import dayjs from "dayjs";
import VoucherModal from "./VoucherModal/VoucherModal";
import VoucherTable from "./VoucherTable";
import ActionButtons from "./ActionButtons";
import { Form } from "antd";
import { getVouchers, createVoucher, updateVoucher } from "../../../api/VoucherApi";
import "./Voucher.css";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // Hàm tải vouchers từ API
  const loadVouchers = useCallback(async () => {
    const data = await getVouchers();
    setVouchers(data || []);
  }, []);

  // Fetch vouchers từ VoucherApi khi component mount
  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Search vouchers
  const handleSearch = (text) => {
    setSearchText(text);
  };

  // Filter vouchers based on search text
  const filteredVouchers = (vouchers || []).filter((voucher) =>
    voucher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Open modal for add/update
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
        status: "Khả dụng",
        create_at: dayjs(),
        expired_at: dayjs().add(30, "day"),
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
    form.resetFields();
  };

  // Save (Add/Update) Voucher
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.create_at = values.create_at.toISOString();
      values.expired_at = values.expired_at.toISOString();
      values.status = dayjs(values.expired_at).isBefore(dayjs())
        ? "Không khả dụng"
        : "Khả dụng";

      if (editingVoucher) {
        await updateVoucher(editingVoucher.id, values);
      } else {
        await createVoucher(values);
      }

      await loadVouchers(); // Tải lại danh sách vouchers sau khi lưu
      handleCancel();
      message.success(editingVoucher ? "Chỉnh sửa trạng thái voucher thành công!" : "Thêm voucher thành công!");
    } catch (error) {
      console.error("Error saving voucher:", error);
      message.error("Lưu voucher thất bại!");
    }
  };

  return (
    <div className="voucher-container">
      <h1 className="voucher-title">Quản lý Voucher</h1>
      <ActionButtons onAdd={() => showModal()} searchText={searchText} setSearchText={handleSearch} />
      <VoucherTable vouchers={filteredVouchers} onEdit={showModal} />
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