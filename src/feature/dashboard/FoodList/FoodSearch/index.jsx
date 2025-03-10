import { useState } from "react";
import "./FoodSearch.css";

const FoodSearch = ({ foods, onSearch }) => {
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const handleSearch = () => {
    onSearch({ query, priceFilter });
  };

  return (
    <div className="food-search">
      <input
        type="text"
        className="food-search-input"
        placeholder="Tìm kiếm món ăn..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <select
        className="food-filter"
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
      >
        <option value="all">Tất cả giá</option>
        <option value="low">Dưới 50K</option>
        <option value="medium">50K - 100K</option>
        <option value="high">Trên 100K</option>
      </select>
      
      <button className="food-search-btn" onClick={handleSearch}>Tìm kiếm</button>
    </div>
  );
};

export default FoodSearch;