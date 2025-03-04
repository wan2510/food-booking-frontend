import React from "react";
import "./whyChooseUs.css";

const features = [
  {
    icon: "🍔",
    title: "Đồ ăn nhanh chất lượng",
    description: "Chúng tôi cung cấp các món ăn nhanh tươi ngon, đảm bảo vệ sinh an toàn thực phẩm."
  },
  {
    icon: "🏠",
    title: "Không gian thoải mái",
    description: "Chúng tôi mang đến một không gian sạch sẽ, thoáng mát và ấm cúng, phù hợp để tận hưởng bữa ăn trọn vẹn"
  },
  {
    icon: "🏆",
    title: "Được khách hàng yêu thích",
    description: "Nhận được hàng ngàn đánh giá tích cực từ khách hàng trên toàn quốc."
  }
];

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <h2 className="section-title">Về chúng tôi</h2>
      <div className="feature-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;