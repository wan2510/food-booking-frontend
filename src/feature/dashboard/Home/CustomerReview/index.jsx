import React, { useState } from 'react';
import './customerReviews.css';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([
        {
            avatar: 'src/assets/image/user1.jpg',
            name: 'Nguyễn Văn A',
            review: 'Món ăn rất ngon, phục vụ tận tình, mình sẽ quay lại!',
            rating: 5,
        },
        {
            avatar: 'src/assets/image/user2.jpg',
            name: 'Trần Thị B',
            review: 'Không gian quán thoải mái, món ăn hợp khẩu vị.',
            rating: 4,
        },
        {
            avatar: 'src/assets/image/user3.jpg',
            name: 'Lê Hoàng C',
            review: 'Giao hàng nhanh, đồ ăn nóng hổi, rất hài lòng.',
            rating: 5,
        },
    ]);

    const [newReview, setNewReview] = useState({
        name: '',
        review: '',
        rating: 5,
    });

    const handleChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (newReview.name && newReview.review) {
            setReviews([
                { ...newReview, avatar: 'src/assets/image/default-avatar.jpg' },
                ...reviews,
            ]);
            setNewReview({ name: '', review: '', rating: 5 });
        }

        return (
            <div className="reviews-section">
                <h2 className="section-title">Đánh giá từ khách hàng</h2>

                <div className="reviews-container">
                    {reviews.map((customer, index) => (
                        <div key={index} className="review-card">
                            <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="avatar"
                            />
                            <h3 className="customer-name">{customer.name}</h3>
                            <p className="customer-review">
                                "{customer.review}"
                            </p>
                            <div className="customer-rating">
                                {'★'.repeat(customer.rating) +
                                    '☆'.repeat(5 - customer.rating)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="review-form">
                    <h3>Viết đánh giá của bạn</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên của bạn"
                        value={newReview.name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="review"
                        placeholder="Nhập đánh giá của bạn..."
                        value={newReview.review}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <select
                        name="rating"
                        value={newReview.rating}
                        onChange={handleChange}
                    >
                        {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>
                                {star} sao
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSubmit}>Gửi đánh giá</button>
                </div>
            </div>
        );
    };
};
export default CustomerReviews;
