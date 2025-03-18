import React from "react";
import { Input } from "antd";

const HandleSearchFood = ({ searchText, setSearchText }) => {
  return (
    <Input
      placeholder="Tìm kiếm món ăn..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
  );
};

export default HandleSearchFood;