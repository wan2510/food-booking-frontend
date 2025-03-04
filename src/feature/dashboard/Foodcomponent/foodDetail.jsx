import React from "react";
import { useParams } from "react-router-dom";
import foodList from "./foodData";
import './foodDetail.css'

const FoodDetail = () => {
  const { id } = useParams();
  const food = foodList.find((item) => item.id === parseInt(id));

  if (!food) {
    return <h2>Món ăn không tồn tại!</h2>;
  }

  return (
    <div className="food-detail">
      <img src={food.img} alt={food.name} className="food-image" />
      <div className="food-info">
        <h1>{food.name}</h1>
        <p>{food.description}</p>
        <h3>Giá: {food.price.toLocaleString()} VND</h3>
        <button className="add-to-cart">Thêm vào giỏ hàng</button>
      </div>
    </div>
  );
};

export default FoodDetail;