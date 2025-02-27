import React from "react";
import { Row, Col, Card } from "antd";

const HandleOrderFood = ({ menuItems = [], bill = [], addToBill }) => {
  const handleAddToBill = (item) => {
    addToBill((prevBill) => {
      const existingItem = prevBill.find((billItem) => billItem.id === item.id);
      if (existingItem) {
        return prevBill.map((billItem) =>
          billItem.id === item.id
            ? { ...billItem, quantity: billItem.quantity + 1 }
            : billItem
        );
      }
      return [...prevBill, { ...item, quantity: 1 }];
    });
  };

  return (
    <Row gutter={[16, 16]}>
      {menuItems.map((item) => (
        <Col span={8} key={item.id}>
          <Card
            hoverable
            cover={
              <img
                alt={item.name}
                src={item.image || "https://via.placeholder.com/150"}
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                style={{ height: 150, objectFit: "cover" }}
              />
            }
            onClick={() => handleAddToBill(item)}
          >
            <Card.Meta
              title={item.name}
              description={`${item.price.toLocaleString()} VND`}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default HandleOrderFood;
