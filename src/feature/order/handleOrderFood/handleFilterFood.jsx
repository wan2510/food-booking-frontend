import React from "react";
import { Card, Checkbox, Row, Col } from "antd";

const HandleFilterFood = ({ foodCategories, selectedCategories, setSelectedCategories }) => {
  return (
    <Card title="Lọc theo danh mục">
      <Row>
        {foodCategories.map((category) => (
          <Col span={24} key={category.id}>
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => {
                setSelectedCategories((prev) =>
                  e.target.checked ? [...prev, category.id] : prev.filter((id) => id !== category.id)
                );
              }}
            >
              {category.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default HandleFilterFood;
