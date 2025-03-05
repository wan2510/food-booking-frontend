import React from "react";
import "./customerReviews.css";

const reviews = [
  {
    avatar: "src/assets/image/user1.jpg",
    name: "Nguyễn Văn A",
    review: "Món ăn rất ngon, phục vụ tận tình, mình sẽ quay lại!",
    rating: 5,
  },
  {
    avatar: "src/assets/image/user2.jpg",
    name: "Trần Thị B",
    review: "Không gian quán thoải mái, món ăn hợp khẩu vị.",
    rating: 4,
  },
  {
    avatar: "src/assets/image/user3.jpg",
    name: "Lê Hoàng C",
    review: "Giao hàng nhanh, đồ ăn nóng hổi, rất hài lòng.",
    rating: 5,
  },
];

const CustomerReviews = () => {
  return (
    <div className="reviews-section">
      <h2 className="section-title">Đánh giá từ khách hàng</h2>
      <div className="reviews-container">
        {reviews.map((customer, index) => (
          <div key={index} className="review-card">
            <img src={customer.avatar} alt={customer.name} className="avatar" />
            <h3 className="customer-name">{customer.name}</h3>
            <p className="customer-review">"{customer.review}"</p>
            <div className="customer-rating">
              {"★".repeat(customer.rating) + "☆".repeat(5 - customer.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;