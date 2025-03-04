import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./foodExamples.css";

const foodItems = [
  {
    image: "src/assets/image/khoaitaychien.jpg",
    category: "Món ăn nhẹ",
    name: "Khoai Tây Chiên (M/L)",
    price: "35.000đ / 50.000đ",
    description: "Khoai tây chiên giòn rụm, ăn kèm sốt phô mai.",
    rating: 4,
  },
  {
    image: "src/assets/image/tacobo.jpg",
    category: "Món chính",
    name: "Taco Bò",
    price: "50.000đ",
    description: "Taco bò thơm ngon, nhân thịt bò đậm đà cùng rau tươi.",
    rating: 5,
  },
  {
    image: "src/assets/image/pizzabo.jpg",
    category: "Pizza",
    name: "Pizza Bò",
    price: "105.000đ / 135.000đ / 165.000đ",
    description: "Pizza bò với phô mai kéo sợi, sốt cà chua đặc trưng.",
    rating: 5,
  },
  {
    image: "src/assets/image/pizzaphomai.jpg",
    category: "Pizza",
    name: "Pizza Phô Mai",
    price: "100.000đ / 125.000đ / 155.000đ",
    description: "Pizza phô mai thơm lừng, béo ngậy với nhiều lớp phô mai.",
    rating: 5,
  },
];

const Food = () => {
  return (
    <div className="food-section">
      <div className="food-header">
        <h2>Món ăn</h2>
        <Link to="/foodlist" className="view-all">
          Xem tất cả <FaArrowRight />
        </Link>
      </div>
      <div className="foodex-container">
        {foodItems.map((item, index) => (
          <div key={index} className="food-item">
            <img src={item.image} alt={item.name} className="foodEx-image" />
            <p className="food-category">{item.category}</p>
            <h3 className="food-name">{item.name}</h3>
            <p className="food-price">{item.price}</p>
            <p className="food-description">{item.description}</p>
            <div className="food-rating">
              {"★".repeat(item.rating) + "☆".repeat(5 - item.rating)}
            </div>
            <Link to="/foodlist" className="food-link">
              <FaArrowRight />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;