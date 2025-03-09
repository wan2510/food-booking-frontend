import React from "react";
import { Link } from "react-router-dom";
import "./foodExample.css";

const foodList = [
  { id: 1, name: "Burger Bò Phô Mai", image: "src/assets/image/burgephomai.jpg", price: "79.000đ" },
  { id: 2, name: "Pizza Hải Sản", image: "src/assets/image/pizzahaisan.jpg", price: "129.000đ" },
  { id: 3, name: "Pizza Bò", image: "src/assets/image/pizzabo.jpg", price: "105.000đ" },
  { id: 4, name: "Taco Bò", image: "src/assets/image/tacobo.jpg", price: "50.000đ" },
];

const FoodExamples = () => {
  return (
    <div className="food-examples">
      <h2>Một số món ăn đặc sắc</h2>
      <div className="food-list">
        {foodList.map((food) => (
          <div key={food.id} className="food-card">
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            <p className="price">{food.price}</p>
          </div>
        ))}
      </div>
      <Link to="/foodlist" className="view-more">
        Xem tất cả món ăn →
      </Link>
    </div>
  );
};

export default FoodExamples;