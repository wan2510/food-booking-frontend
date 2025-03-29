import React from "react";
import { InputNumber, Typography } from "antd";

const { Text } = Typography;

const CashPayment = ({ cashReceived, onChange, finalTotal }) => {
  const change = cashReceived >= finalTotal ? cashReceived - finalTotal : 0;

  return (
    <div>
      <Text strong>Số tiền khách đưa: </Text>
      <InputNumber
        value={cashReceived}
        onChange={onChange}
        style={{ width: "100%", marginTop: 8 }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        min={0}
      />
      {cashReceived > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Tiền thừa: </Text>
          <Text>{change.toLocaleString("vi-VN")} VND</Text>
        </div>
      )}
    </div>
  );
};

export default CashPayment;