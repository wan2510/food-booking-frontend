import { useState } from "react";
import FoodSearch from "./FoodSearch";
import ListFood from "./ListFood";

const FoodList = () => {
    const [filteredFoods, setFilteredFoods] = useState([]);

    const handleSearch = (foods) => {
        setFilteredFoods(foods);
    };

    return (
        <div>
            <FoodSearch onSearch={handleSearch} />
            <ListFood foods={filteredFoods} />
        </div>
    );
};

export default FoodList;