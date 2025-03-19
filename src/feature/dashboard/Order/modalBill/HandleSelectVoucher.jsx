import React from "react";
import { Select } from "antd";

const { Option } = Select;

const HandleSelectVoucher = ({ vouchers, selectedVoucher, setSelectedVoucher }) => {
  return (
    <Select
      placeholder="Chọn voucher"
      style={{ width: "100%" }}
      value={selectedVoucher ? selectedVoucher.id : undefined} 
      onChange={(value) => {
        const voucher = vouchers.find((v) => v.id === value);
        setSelectedVoucher(voucher || null);
      }}
    >
      {vouchers && vouchers.length > 0 ? (
        vouchers.map((voucher) => (
          <Option key={voucher.id} value={voucher.id} disabled={voucher.status === "Không khả dụng"}>
            {`${voucher.code} - Giảm ${voucher.discount}% (Tối đa ${voucher.max_discount_value.toLocaleString()} VND)`}
          </Option>
        ))
      ) : (
        <Option value="" disabled>
          Không có voucher
        </Option>
      )}
    </Select>
  );
};

export default HandleSelectVoucher;