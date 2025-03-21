import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./banner.css";

const Banner = () => {
  const navigate = useNavigate();
  const handleOrderClick = () => {
    navigate("/book");
  };

  return (
    <div className="banner-container">
      <div className="banner-content">
        Welcome
        <Button type="primary" className="order-button" onClick={handleOrderClick}>
          Đặt bàn ngay
        </Button>
      </div>
    </div>
  );
};

export default Banner;