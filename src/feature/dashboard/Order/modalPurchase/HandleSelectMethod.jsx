import React from "react";
import { Select } from "antd";

const { Option } = Select;

const PaymentMethodSelector = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={onChange} style={{ width: "100%", marginBottom: 16 }}>
      <Option value="Tiền mặt">Tiền mặt</Option>
      <Option value="Chuyển khoản">Chuyển khoản</Option>
    </Select>
  );
};

export default PaymentMethodSelector;