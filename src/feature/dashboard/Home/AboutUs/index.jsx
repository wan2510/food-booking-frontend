import React from "react";
import "./aboutUs.css";
import { FaUtensils, FaDollarSign, FaTruck, FaLeaf } from "react-icons/fa";

const AboutUs = () => {
  const reasons = [
    { icon: <FaUtensils />, title: "Chất lượng hàng đầu", desc: "Món ăn được chế biến từ đầu bếp chuyên nghiệp, hương vị độc đáo." },
    { icon: <FaDollarSign />, title: "Giá cả hợp lý", desc: "Giá cả hợp lí, phù hợp với mọi khách hàng." },
    { icon: <FaLeaf />, title: "Nguyên liệu tươi", desc: "Sử dụng nguyên liệu sạch, tươi ngon và an toàn." },
  ];

  return (
    <section className="why-choose-us">
      <h2 className="section-title">Về Chúng Tôi</h2>
      <div className="reasons-grid">
        {reasons.map((reason, index) => (
          <div key={index} className="reason-item">
            <div className="icon">{reason.icon}</div>
            <h3>{reason.title}</h3>
            <p>{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;