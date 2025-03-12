import React, { useState } from "react";
import { List, Button, InputNumber, Typography, Space, Select, Card, Popconfirm } from "antd";

const { Title } = Typography;

const ModalBill = ({ bill, updateItem, vouchers, tables }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const totalPrice = bill.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = selectedVoucher ? Math.min((totalPrice * selectedVoucher.discount) / 100, selectedVoucher.max_discount_value) : 0;
  const finalPrice = totalPrice - discount;

  return (
    <Card title="Chi tiết đơn hàng" style={{ width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Chọn bàn */}
        <Select
          placeholder="Chọn bàn"
          style={{ width: "100%" }}
          value={selectedTable}
          onChange={setSelectedTable}
        >
          {tables.map((table) => (
            <Select.Option key={table.number} value={table.number}>
              {`Bàn ${table.number} - ${table.max_number_human} người`}
            </Select.Option>
          ))}
        </Select>

        {/* Danh sách món ăn */}
        <List
          dataSource={bill}
          renderItem={(item) => (
            <div className="bill-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "10px" }}>
              <div>
                <div><strong>{item.name}</strong></div>
                <div style={{ fontSize: "12px", color: "gray" }}>Đơn giá: {item.price.toLocaleString()} VND</div>
              </div>

              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(value) => updateItem(item.id, value)}
                style={{ width: "60px", textAlign: "center" }}
              />

              <div style={{ fontWeight: "bold", minWidth: "100px", textAlign: "right" }}>
                { (item.price * item.quantity).toLocaleString() } VND
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
        <Select
          placeholder="Chọn voucher"
          style={{ width: "100%" }}
          value={selectedVoucher?.discount}
          onChange={(value) => setSelectedVoucher(vouchers.find(v => v.discount === value))}
        >
          {vouchers.map((voucher) => (
            <Select.Option key={voucher.discount} value={voucher.discount}>
              {`Giảm ${voucher.discount}% (Tối đa ${voucher.max_discount_value.toLocaleString()} VND)`}
            </Select.Option>
          ))}
        </Select>

        {/* Hiển thị tổng tiền */}
        <Title level={4} style={{ marginTop: 16, color: "#ff6600" }}>Tổng tiền: {totalPrice.toLocaleString()} VND</Title>
        {selectedVoucher && (
          <>
            <Title level={5}>Giảm giá: -{discount.toLocaleString()} VND</Title>
            <Title level={4}>Thành tiền: {finalPrice.toLocaleString()} VND</Title>
          </>
        )}
      </Space>
    </Card>
  );
};

export default ModalBill;