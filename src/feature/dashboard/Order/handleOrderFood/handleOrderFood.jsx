import React, { useState } from "react";
import { Row, Col } from "antd";
import HandleSearchFood from "./HandleSearchFood";
import HandleFilterFood from "./HandleFilterFood";
import HandleSelectFood from "./HandleSelectFood";

const HandleOrderFood = ({ menuItems, addToBill, foodCategories }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredMenu = (menuItems || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <HandleSearchFood searchText={searchText} setSearchText={setSearchText} />
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <HandleFilterFood
            foodCategories={foodCategories || []}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </Col>
        <Col span={18}>
          {filteredMenu.length > 0 ? (
            <HandleSelectFood filteredMenu={filteredMenu} addToBill={addToBill} />
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              Không có món ăn nào phù hợp.
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HandleOrderFood;