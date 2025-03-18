import React from "react";
import { Input } from "antd";

const HandleSearchFood = ({ searchText, setSearchText }) => {
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Input
      placeholder="Tìm kiếm món ăn..."
      value={searchText}
      onChange={handleInputChange}
      style={{ marginBottom: "10px", width: "100%" }}
      allowClear
    />
  );
};

export default HandleSearchFood;