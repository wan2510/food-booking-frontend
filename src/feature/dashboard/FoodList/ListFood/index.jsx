import { useEffect, useState } from "react";
import "./listFood.css";

const FoodList = () => {
  const [foods, setFoods] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/food")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFoods(data);
        } else if (Array.isArray(data.foods)) {
          setFoods(data.foods);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu món ăn:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="food-list-container">
      <h2 className="title">Danh sách món ăn</h2>
      {error ? (
        <p style={{ color: "red" }}>Lỗi: {error}</p>
      ) : foods.length > 0 ? (
        <div className="food-grid">
          {foods.map((food) => (
            <div className="food-card" key={food.uuid || food.id}>
              {food.imageUrl && (
                <img className="food-image" src={food.imageUrl} alt={food.name} />
              )}
              <h3 className="food-name">{food.name}</h3>
              <p className="food-price">{food.price} VND</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có món ăn nào.</p>
      )}
    </div>
  );
};

export default FoodList;