import React, { useState } from "react";
import foodData from "./foodData";
import "./foodList.css";

const FoodList = () => {
  const [foods, setFoods] = useState(foodData);

  return (
    <div className="food-grid">
      {foods.map((food) => (
        <div key={food.id} className="food-item">
          <img src={food.image} alt={food.name} />
          <h3>{food.name}</h3>
          <p className="food-description">{food.description}</p>
          <p>{food.price.toLocaleString()} VND</p>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
