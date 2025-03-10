import React from "react";
import "./specialOffers.css";

const offers = [
  {
    image: "https://via.placeholder.com/200",
    title: "Giảm 20% Combo Gà Rán",
    description: "Thưởng thức combo gà rán giòn ngon với giá ưu đãi.",
    discountedPrice: "120.000đ",
    originalPrice: "150.000đ",
    discountLabel: "-20%",
    expiryDate: "Hết hạn: 28/02/2025"
  },
  {
    image: "https://via.placeholder.com/200",
    title: "Mua 1 Tặng 1 Pizza",
    description: "Mua một chiếc pizza bất kỳ, tặng ngay một chiếc tương tự!",
    discountedPrice: "199.000đ",
    originalPrice: "398.000đ",
    discountLabel: "Mua 1 Tặng 1",
    expiryDate: "Hết hạn: 05/03/2025"
  },
  {
    image: "https://via.placeholder.com/200",
    title: "Combo Burger và Nước Ngọt",
    description: "Combo đặc biệt gồm 1 burger bò, khoai tây chiên và nước ngọt.",
    discountedPrice: "99.000đ",
    originalPrice: "130.000đ",
    discountLabel: "Tiết kiệm 30.000đ",
    expiryDate: "Hết hạn: 10/03/2025"
  }
];

const SpecialOffers = () => {
  return (
    <div className="special-offers">
      <h2 className="section-title">Ưu đãi đặc biệt</h2>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <span className="discount-label">{offer.discountLabel}</span>
            <img src={offer.image} alt={offer.title} className="offer-image" />
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-description">{offer.description}</p>
            <p className="offer-price">
              <span className="original-price">{offer.originalPrice}</span>
              {" "}→ <span className="discounted-price">{offer.discountedPrice}</span>
            </p>
            <p className="expiry-date">{offer.expiryDate}</p>
            <button className="offer-button">Xem chi tiết</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;