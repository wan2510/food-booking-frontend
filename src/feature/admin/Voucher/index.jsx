import React, { useState, useEffect, useCallback } from "react";
import { Form, message, Modal } from "antd";
import dayjs from "dayjs";
import VoucherModal from "./VoucherModal/VoucherModal";
import VoucherTable from "./VoucherTable";
import ActionButtons from "./ActionButtons";

const API_URL = "http://localhost:8080/api/vouchers";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // Fetch vouchers from backend
  const loadVouchers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getVouchers`);
      if (!response.ok) throw new Error("Failed to fetch vouchers");
      const data = await response.json();
      setVouchers(data);
      setFilteredVouchers(data);
    } catch (error) {
      console.error("Error loading vouchers:", error);
      message.error("Không thể tải danh sách voucher!");
    }
  }, []);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Search vouchers
  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredVouchers(
      vouchers.filter((voucher) =>
        voucher.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

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

      let response;
      if (editingVoucher) {
        response = await fetch(`${API_URL}/updateVoucher/${editingVoucher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } else {
        response = await fetch(`${API_URL}/addVoucher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }

      if (!response.ok) throw new Error("Lưu voucher thất bại");

      loadVouchers();
      handleCancel();
      message.success("Lưu voucher thành công!");
    } catch (error) {
      console.error("Error saving voucher:", error);
      message.error("Lưu voucher thất bại!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <ActionButtons onAdd={() => showModal()} searchText={searchText} setSearchText={handleSearch} />
      <VoucherTable vouchers={filteredVouchers} onEdit={showModal} />
      <VoucherModal visible={isModalOpen} onClose={handleCancel} onSave={handleSave} form={form} editingVoucher={editingVoucher} />
    </div>
  );
};

export default Voucher;
