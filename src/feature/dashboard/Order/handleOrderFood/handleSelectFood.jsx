import React, { useState } from "react";
import { Row, Col, Card } from "antd";

const HandleSelectFood = ({ filteredMenu, addToBill }) => {
  const [imageError, setImageError] = useState({});

  return (
    <Row gutter={[16, 16]}>
      {filteredMenu.map((item) => (
        <Col span={8} key={item.id}>
          <Card hoverable onClick={() => addToBill(item)}>
            {!imageError[item.id] ? (
              <img
                alt={item.name}
                src={item.image}
                style={{ width: "100%", height: "auto", display: "block" }}
                onError={() => setImageError((prev) => ({ ...prev, [item.id]: true }))}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#999" }}>
                Không thể tải ảnh
              </div>
            )}
            <Card.Meta title={item.name} description={`${item.price.toLocaleString()} VND`} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default HandleSelectFood;