import React, { useState } from "react";
import { Modal, List, Button, InputNumber, Typography } from "antd";
import HandleSelectTable from "./handleSelectTable";
import HandleSelectVoucher from "./handleSelectVoucher";

const { Title } = Typography;

const ModalBill = ({ visible, onClose, bill, updateItem, vouchers, tables }) => {
  const [selectedTable, setSelectedTable] = useState(null); 
  const totalPrice = bill.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Modal title="Chi tiết đơn hàng" open={visible} onCancel={onClose} footer={null} width={600}>
      <List
        bordered
        dataSource={bill}
        renderItem={(item) => (
          <List.Item actions={[
            <InputNumber min={0} value={item.quantity} onChange={(value) => updateItem(item.id, value)} />,
            <Button type="link" danger onClick={() => updateItem(item.id, 0)}>Xóa</Button>
          ]}>
            <List.Item.Meta title={item.name} description={`Giá: ${item.price.toLocaleString()} VND`} />
          </List.Item>
        )}
      />
      <Title level={4} style={{ marginTop: 16 }}>Tổng tiền: {totalPrice.toLocaleString()} VND</Title>
    </Modal>
  );
};

export default ModalBill;
