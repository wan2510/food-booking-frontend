import React, { useState } from "react";
import { Row, Col, Layout, Typography, Card, Button, message } from "antd";
import HandleOrderFood from "./handleOrderFood/handleOrderFood";
import ModalBill from "./handleCreateBill.jsx/modalBill";
import "./order.css";

const { Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { id: 1, name: "Pizza", price: 150000, image: "", category: "Fast Food" },
  { id: 2, name: "Burger", price: 80000, image: "", category: "Fast Food" },
  { id: 3, name: "Sushi", price: 200000, image: "", category: "Japanese" },
];

const foodCategories = [
  { id: "Fast Food", name: "Fast Food" },
  { id: "Japanese", name: "Japanese" },
  { id: "Drinks", name: "Drinks" },
  { id: "Desserts", name: "Desserts" },
];

const tables = [
  { number: 1, max_number_human: 4 },
  { number: 2, max_number_human: 6 },
  { number: 3, max_number_human: 2 },
];

const vouchers = [
  { discount: 10, max_discount_value: 50000 },
  { discount: 20, max_discount_value: 100000 },
  { discount: 15, max_discount_value: 70000 },
];

const OrderPage = () => {
  const [bill, setBill] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const addToBill = (item) => {
    setBill((prevBill) => {
      const updatedBill = prevBill.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return prevBill.some((i) => i.id === item.id)
        ? updatedBill
        : [...updatedBill, { ...item, quantity: 1 }];
    });
  };

  const updateItem = (id, quantity) => {
    setBill((prev) =>
      quantity === 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const handleCreateBill = () => {
    if (!selectedTable) {
      message.error("Vui lòng chọn bàn trước khi tạo hóa đơn!");
      return;
    }
    if (bill.length === 0) {
      message.error("Chưa có món nào trong hóa đơn!");
      return;
    }

    const totalPrice = bill.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = selectedVoucher
      ? Math.min((totalPrice * selectedVoucher.discount) / 100, selectedVoucher.max_discount_value)
      : 0;
    const finalPrice = totalPrice - discount;

    const orderData = {
      table: selectedTable,
      items: bill,
      total: totalPrice,
      discount,
      finalTotal: finalPrice,
    };

    message.success("Hóa đơn đã được tạo!");
    console.log(orderData);
  };

  return (
    <Layout className="order-page">
      <Content className="order-content">
        <Row gutter={16} className="order-container">
          {/* Cột menu */}
          <Col span={16}>
            <Card className="menu-container">
              <Title level={2}>Menu</Title>
              <HandleOrderFood
                menuItems={menuItems}
                addToBill={addToBill}
                foodCategories={foodCategories}
              />
            </Card>
          </Col>

          {/* Cột hóa đơn */}
          <Col span={8}>
            <Card className="bill-container">
              <Title level={2}>Hóa đơn</Title>
              <ModalBill
                bill={bill}
                updateItem={updateItem}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                selectedVoucher={selectedVoucher}
                setSelectedVoucher={setSelectedVoucher}
                vouchers={vouchers}
                tables={tables}
              />
              <Button type="primary" className="create-bill-btn" onClick={handleCreateBill}>
                Tạo hóa đơn
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default OrderPage;
