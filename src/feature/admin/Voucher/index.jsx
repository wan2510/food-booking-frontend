import React, { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";

import VoucherModal from "./VoucherModal/VoucherModal";
import VoucherTable from "./VoucherTable";
import ActionButtons from "./ActionButtons";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "XINCHAONGUOIMOI1",
      name: "Giảm giá 20K",
      type: "cho người dùng",
      discount: 20,
      max_discount_value: 300,
      min_order_value: 100,
      expired_at: dayjs("19/02/2025", "DD/MM/YYYY").toISOString(),
      create_at: dayjs("01/02/2025", "DD/MM/YYYY").toISOString(),
      status: "Không khả dụng",
    },
    {
      id: 2,
      code: "TOILADUCMINH",
      name: "Nguyễn Đức Minh",
      type: "cho khách vip",
      discount: 4,
      max_discount_value: 4,
      min_order_value: 4,
      expired_at: dayjs("10/03/2025", "DD/MM/YYYY").toISOString(),
      create_at: dayjs("10/03/2025", "DD/MM/YYYY").toISOString(),
      status: "Khả dụng",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [sortedVouchers, setSortedVouchers] = useState([...vouchers]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

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
        expired_at: dayjs(),
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      values.create_at = values.create_at.toISOString();
      values.expired_at = values.expired_at.toISOString();

      const isExpired = dayjs(values.expired_at).endOf("day").isBefore(dayjs());
      values.status = isExpired ? "Không khả dụng" : "Khả dụng";

      const updatedVouchers = editingVoucher
        ? vouchers.map((v) => (v.id === editingVoucher.id ? { ...v, ...values } : v))
        : [...vouchers, { id: Date.now(), ...values }];

      setVouchers(updatedVouchers);
      applyFilters(updatedVouchers, searchText);
      handleCancel();
    });
  };

  const applyFilters = (data, searchValue) => {
    let filteredData = [...data];
    const trimmedSearch = searchValue.trim().toLowerCase();
    
    if (trimmedSearch) {
      filteredData = filteredData.filter((voucher) =>
        voucher.name.toLowerCase().includes(trimmedSearch)
      );
    }

    if (sortField) {
      filteredData.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (dayjs(valA).isValid() && dayjs(valB).isValid()) {
          return sortOrder === "asc" ? dayjs(valA).diff(dayjs(valB)) : dayjs(valB).diff(dayjs(valA));
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return sortOrder === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }

    setSortedVouchers(filteredData);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    applyFilters(vouchers, searchText);
  };

  return (
    <div style={{ padding: 20 }}>
      <ActionButtons
        onAdd={() => showModal()}
        searchText={searchText}
        setSearchText={(text) => {
          setSearchText(text);
          applyFilters(vouchers, text);
        }}
        onSort={handleSort}
      />

      <VoucherTable vouchers={sortedVouchers} onEdit={showModal} />

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