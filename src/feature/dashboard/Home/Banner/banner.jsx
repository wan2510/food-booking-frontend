import React from "react";
import { Button } from "antd";
import "./banner.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-content">
        Welcome
        <Button type="primary" className="order-button">
          Đặt hàng ngay
        </Button>
      </div>
    </div>
  );
};

export default Banner;