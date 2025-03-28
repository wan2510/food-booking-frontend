import React, { useState } from "react";
import { Row, Col, Card } from "antd";

const HandleSelectFood = ({ filteredMenu, addToBill }) => {
  const [imageError, setImageError] = useState({});

  const handleImageError = (itemId) => {
    setImageError((prev) => ({ ...prev, [itemId]: true }));
  };

  return (
    <Row gutter={[16, 16]}>
      {filteredMenu.length > 0 ? (
        filteredMenu.map((item) => (
          <Col span={8} key={item.id}>
            <Card
              hoverable
              onClick={() => addToBill(item)}
              className="food-card" // Thêm class để áp dụng style
              cover={
                !imageError[item.id] ? (
                  <img
                    alt={item.name}
                    src={item.image || ""}
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                      backgroundColor: "#f5f5f5",
                      height: "200px", // Đảm bảo chiều cao đồng đều với hình ảnh
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Không thể tải ảnh
                  </div>
                )
              }
            >
              <Card.Meta
                title={item.name}
                description={`${item.price.toLocaleString()} VND`}
              />
            </Card>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
            Không có món ăn để hiển thị.
          </div>
        </Col>
      )}
    </Row>
  );
};

export default HandleSelectFood;