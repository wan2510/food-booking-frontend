import React from "react";
import { List, Button, InputNumber, Typography, Space, Card, Popconfirm } from "antd";
import HandleSelectTable from "./HandleSelectTable";
import HandleSelectVoucher from "./handleSelectVoucher";
import { getTotalPrice, getDiscount, getFinalPrice } from "../OrderApi";

const { Title } = Typography;

const ModalBill = ({ bill, updateItem, vouchers, tables, selectedTable, setSelectedTable, selectedVoucher, setSelectedVoucher }) => {
  const totalPrice = getTotalPrice();
  const discount = getDiscount(); // Giảm giá
  const finalPrice = getFinalPrice(); // Thực chi

  return (
    <Card title="Chi tiết đơn hàng" style={{ width: "100%" }} variant="bordered"> {/* Thay 'bordered' bằng 'variant' */}
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Chọn bàn */}
        <HandleSelectTable
          tables={tables}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />

        {/* Danh sách món ăn */}
        <List
          dataSource={bill}
          renderItem={(item) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "10px" }}>
              <div>
                <div><strong>{item.name}</strong></div>
                <div style={{ fontSize: "12px", color: "gray" }}>Đơn giá: {item.price.toLocaleString()} VND</div>
              </div>

              <InputNumber
                min={1}
                max={50}
                value={item.quantity}
                onChange={(value) => updateItem(item.id, value)}
                style={{ width: "60px", textAlign: "center" }}
              />

              <div style={{ fontWeight: "bold", minWidth: "100px", textAlign: "right" }}>
                {(item.price * item.quantity).toLocaleString()} VND
              </div>

              <Popconfirm
                title="Bạn có chắc chắn muốn xóa không?"
                onConfirm={() => updateItem(item.id, 0)}
                okText="Có"
                cancelText="Không"
              >
                <Button style={{ background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer" }}>
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          )}
        />

        {/* Chọn voucher */}
        <HandleSelectVoucher
          vouchers={vouchers}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
        />

        {/* Hiển thị tổng tiền */}
        <Title level={4} style={{ marginTop: 16, color: "#ff6600" }}>Tổng bill: {totalPrice.toLocaleString()} VND</Title>
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

export default ModalBill;