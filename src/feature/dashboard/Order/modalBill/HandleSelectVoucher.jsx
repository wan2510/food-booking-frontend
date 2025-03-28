import React from "react";
import { Select } from "antd";

const { Option } = Select;

const HandleSelectVoucher = ({ vouchers, selectedVoucher, setSelectedVoucher }) => {
  const handleChange = (voucherId) => {
    const selected = vouchers.find((v) => v.id === voucherId) || null;
    console.log("Selected voucher in HandleSelectVoucher:", selected);
    setSelectedVoucher(selected); // Gọi hàm từ OrderApi với đối tượng voucher
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Select
        style={{ width: "100%" }}
        placeholder="Chọn voucher"
        value={selectedVoucher ? selectedVoucher.id : null}
        onChange={handleChange}
        allowClear
      >
        {vouchers.map((voucher) => (
          <Option key={voucher.id} value={voucher.id}>
            {voucher.code} - {voucher.name} (Giảm {voucher.discount}%, tối đa {voucher.max_discount_value.toLocaleString()} VND)
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default HandleSelectVoucher;