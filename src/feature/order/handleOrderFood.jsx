import React from "react";
import { Row, Col, Card } from "antd";

const HandleOrderFood = ({ menuItems, addToBill }) => {
  return (
    <Row gutter={[16, 16]}>
      {menuItems.map((item) => (
        <Col span={8} key={item.id}>
          <Card
            hoverable
            cover={<img alt={item.name} src={item.image} />}
            onClick={() => addToBill(item)}
          >
            <Card.Meta title={item.name} description={`${item.price.toLocaleString()} VND`} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default HandleOrderFood;
