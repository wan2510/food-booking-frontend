import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import HandleSearchFood from "./HandleSearchFood";
import HandleFilterFood from "./HandleFilterFood";
import HandleSelectFood from "./HandleSelectFood";

const HandleOrderFood = ({ menuItems, addToBill, foodCategories }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Debug dữ liệu
  useEffect(() => {
    console.log("menuItems in HandleOrderFood:", menuItems);
    console.log("foodCategories in HandleOrderFood:", foodCategories);
    console.log("selectedCategories:", selectedCategories);
  }, [menuItems, foodCategories, selectedCategories]);

  // Lọc danh sách món ăn dựa trên tìm kiếm và danh mục
  const filteredMenu = (menuItems || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "0 16px" }}>
      <Row gutter={[16, 16]}>
        {/* Bên trái: Ô tìm kiếm và bộ lọc danh mục */}
        <Col xs={24} md={6}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <HandleSearchFood searchText={searchText} setSearchText={setSearchText} />
            <HandleFilterFood
              foodCategories={foodCategories || []}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </Col>

        {/* Bên phải: Danh sách món ăn */}
        <Col xs={24} md={18}>
          <HandleSelectFood filteredMenu={filteredMenu} addToBill={addToBill} />
        </Col>
      </Row>
    </div>
  );
};

export default HandleOrderFood;