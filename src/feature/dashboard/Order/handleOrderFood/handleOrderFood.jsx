import React, { useState } from "react";
import { Row, Col } from "antd";
import HandleSearchFood from "./handleSearchFood";
import HandleFilterFood from "./handleFilterFood";
import HandleSelectFood from "./handleSelectFood";

const HandleOrderFood = ({ menuItems, addToBill, foodCategories }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <HandleSearchFood searchText={searchText} setSearchText={setSearchText} />
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <HandleFilterFood foodCategories={foodCategories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        </Col>
        <Col span={18}>
          <HandleSelectFood filteredMenu={filteredMenu} addToBill={addToBill} />
        </Col>
      </Row>
    </>
  );
};

export default HandleOrderFood;