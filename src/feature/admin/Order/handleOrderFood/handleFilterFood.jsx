import React from "react";
import { Card, Checkbox, Row, Col } from "antd";

const HandleFilterFood = ({ foodCategories, selectedCategories, setSelectedCategories }) => {
  const handleCategoryChange = (categoryName, checked) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryName] : prev.filter((name) => name !== categoryName)
    );
  };

  return (
    <Card
      title={<span style={{ fontSize: 16, fontWeight: 500 }}>Lọc theo danh mục</span>}
      bordered={false}
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        backgroundColor: "#fff",
      }}
    >
      <Row gutter={[0, 12]}>
        {foodCategories.length > 0 ? (
          foodCategories.map((category) => (
            <Col span={24} key={category.id}>
              <Checkbox
                checked={selectedCategories.includes(category.name)} // Sử dụng category.name
                onChange={(e) => handleCategoryChange(category.name, e.target.checked)} // Sử dụng category.name
                style={{ fontSize: 14 }}
              >
                {category.name}
              </Checkbox>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <p style={{ color: "#999", fontStyle: "italic", margin: 0 }}>
              Không có danh mục nào.
            </p>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default HandleFilterFood;