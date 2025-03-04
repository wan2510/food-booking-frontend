import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./banner.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <img src="src/assets/banner/banner3.jpg" alt="Banner" className="banner-image" />
      <div className="banner-content">
        Welcome
        <Link to="/booking">
          <Button type="primary" size="large" className="banner-btn">
            Đặt bàn ngay
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;