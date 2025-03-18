import React from "react";
import { List, Typography, Space, Card } from "antd";
import { getTotalPrice, getDiscount, getFinalPrice } from "../OrderApi";

const { Title } = Typography;

const ModalBillReadOnly = ({ bill, selectedTable, selectedVoucher, vouchers }) => {
  const totalPrice = getTotalPrice();
  const discount = getDiscount();
  const finalPrice = getFinalPrice();

  return (
    <Card title="Thông tin hóa đơn" style={{ width: "100%" }} variant="bordered">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>Bàn: {selectedTable || "Chưa chọn"}</div>
        <List
          dataSource={bill}
          renderItem={(item) => (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()} VND</span>
            </div>
          )}
        />
        <div>Voucher: {selectedVoucher ? selectedVoucher.code : "Không áp dụng"}</div>
        <Title level={4} style={{ color: "#ff6600" }}>Tổng bill: {totalPrice.toLocaleString()} VND</Title>
        {selectedVoucher && discount > 0 && (
          <>
            <Title level={5}>Giảm giá: -{discount.toLocaleString()} VND</Title>
            <Title level={4}>Thực chi: {finalPrice.toLocaleString()} VND</Title>
          </>
        )}
      </Space>
    </Card>
  );
};

export default ModalBillReadOnly;