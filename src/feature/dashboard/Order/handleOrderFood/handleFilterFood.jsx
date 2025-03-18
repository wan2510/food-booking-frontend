import React from "react";
import { Card, Checkbox, Row, Col } from "antd";

const HandleFilterFood = ({ foodCategories, selectedCategories, setSelectedCategories }) => {
  const handleCategoryChange = (categoryId, checked) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  return (
    <Card title="Lọc theo danh mục" bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={[0, 8]}>
        {foodCategories.length > 0 ? (
          foodCategories.map((category) => (
            <Col span={24} key={category.id}>
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
              >
                {category.name}
              </Checkbox>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <p style={{ color: "#888" }}>Không có danh mục.</p>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default HandleFilterFood;