import React from "react";
import "./featuredMenu.css";

const menuItems = [
  {
    image: "src/assets/image/gasotcayhq.jpg",
    name: "Gà Sốt Cay Hàn Quốc (6 miếng)",
    description: "Gà rán giòn rụm, phủ sốt cay ngọt chuẩn vị Hàn Quốc.",
    price: "155.000đ",
    tag: "Món mới",
    details: "Ức gà tươi, sốt cay Hàn Quốc đặc trưng, tẩm bột giòn. 600 kcal"
  },
  {
    image: "src/assets/image/garantt.jpg",
    name: "Gà Rán Truyền Thống (1 miếng)",
    description: "Gà rán giòn tan, hương vị truyền thống hấp dẫn.",
    price: "40.000đ",
    tag: "Best Seller",
    details: "Đùi gà tươi, tẩm bột chiên giòn, giữ nguyên hương vị tự nhiên. 350 kcal"
  },
  {
    image: "src/assets/image/burgerthitxongkhoi.jpg",
    name: "Burger Thịt Xông Khói BBQ",
    description: "Bánh burger nhân thịt bò kết hợp với thịt xông khói và sốt BBQ đậm đà.",
    price: "70.000đ",
    tag: "Best Seller",
    details: "Thịt bò nướng, thịt xông khói, sốt BBQ, rau tươi, phô mai cheddar. 500 kcal"
  },
];

const FeaturedMenu = () => {
  return (
    <div className="featured-menu">
      <h2 className="section-title">Thực đơn nổi bật</h2>
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <div className="menu-image-container">
              <img src={item.image} alt={item.name} className="menu-image" />
              {item.tag && <span className="menu-tag">{item.tag}</span>}
            </div>
            <h3 className="menu-name">{item.name}</h3>
            
            <div className="menu-description">{item.description}</div>
            
            <p className="menu-price">{item.price}</p>
            
            <div className="menu-details">{item.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedMenu;