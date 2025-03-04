import React, { useState } from "react";
import { Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import "./FilterSearch.css";

const { Option } = Select;

const FilterSearch = ({ foodList, setFilteredFood }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = () => {
    let filtered = foodList.filter((food) =>
      food.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFood(filtered);
  };

  return (
    <div className="filter-search-container">
      <Input
        placeholder="Tìm món ăn..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={handleSearch}
        suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: "pointer" }} />}
        className="search-input"
      />
      <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default FilterSearch;
