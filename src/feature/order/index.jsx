import React, { useState } from "react";
import { Row, Col, Layout } from "antd";
import HandleOrderFood from "./handleOrderFood";

import ModalBill from "./modalBill";

const { Content } = Layout;

const menuItems = [
  { id: 1, name: "Pizza", price: 150000, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Burger", price: 80000, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Sushi", price: 200000, image: "https://via.placeholder.com/150" },
];

const OrderPage = () => {
    const [bill, setBill] = useState([]);

    const addToBill = (item) => {
      setBill((prevBill) => {
        const existingItem = prevBill.find((i) => i.id === item.id);
        if (existingItem) {
          return prevBill.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prevBill, { ...item, quantity: 1 }];
        }
      });
    };
    

  const updateItem = (id, quantity) => {
    setBill((prev) => {
      if (quantity === 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  };

  return (
    <Layout>
      <Content style={{ padding: "20px" }}> <h1>HEADER Các kiểu</h1>
        <br></br>
        <br></br>
        <br></br>
        <Row gutter={16}>
          <Col span={12}>
            <h2>Menu</h2>
            <HandleOrderFood menuItems={menuItems} addToBill={addToBill} />
          </Col>
          <Col span={12}>
            <h2>Hóa đơn</h2>
            <ModalBill bill={bill} updateItem={updateItem} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default OrderPage;