import "./listFood.css";

const ListFood = ({ foods }) => {
  return (
    <div className="food-list">
      {foods.length > 0 ? (
        foods.map((food) => (
          <div key={food.id} className="food-item">
            <img src={food.image} alt={food.name} className="food-image" />
            <h3 className="food-name">{food.name}</h3>
            <p className="food-price">{food.price} VND</p>
          </div>
        ))
      ) : (
        <p className="no-foods">Không tìm thấy món ăn nào.</p>
      )}
    </div>
  );
};

export default ListFood;
