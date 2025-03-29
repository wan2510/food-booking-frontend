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
      style={{
        width: "100%",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #d9d9d9",
      }}
      allowClear
    />
  );
};

export default HandleSearchFood;