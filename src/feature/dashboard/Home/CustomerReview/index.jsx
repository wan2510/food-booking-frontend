import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getReviews, addReview } from '../../../../api/ReviewApi';
import './customerReviews.css';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({
        userName: '',
        content: '',
        rating: 5,
    });

    // Lấy thông tin user từ localStorage nếu có
    const getUserInfo = () => {
        try {
            const userString = localStorage.getItem('user');
            if (userString) {
                return JSON.parse(userString);
            }
            return null;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    };

    const user = getUserInfo();
    const isAuthenticated = !!user;

    const fetchReviews = () => {
        try {
            setLoading(true);
            const data = getReviews();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            message.error('Không thể tải đánh giá. Vui lòng thử lại sau!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        if (isAuthenticated && user) {
            setNewReview(prev => ({
                ...prev,
                userName: user.name || 'Khách hàng',
                userAvatar: user.avatar || '/default-avatar.jpg'
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!newReview.content.trim()) {
            message.warning('Vui lòng nhập nội dung đánh giá!');
            return;
        }

        try {
            const reviewToAdd = {
                ...newReview,
                userAvatar: user?.avatar || '/default-avatar.jpg',
                userName: user?.name || 'Khách hàng'
            };
            
            addReview(reviewToAdd);
            fetchReviews(); // Refresh danh sách đánh giá
            
            // Reset form
            setNewReview(prev => ({
                ...prev,
                content: '',
                rating: 5
            }));
            
            message.success('Đã thêm đánh giá thành công!');
        } catch (error) {
            console.error('Error submitting review:', error);
            message.error('Không thể thêm đánh giá. Vui lòng thử lại!');
        }
    };

    if (loading) {
        return (
            <div className="reviews-section">
                <div className="loading-spinner">Đang tải đánh giá...</div>
            </div>
        );
    }

    return (
        <div className="reviews-section">
            <h2 className="section-title">Đánh giá từ khách hàng</h2>

            {isAuthenticated && (
                <div className="review-form">
                    <h3>Viết đánh giá của bạn</h3>
                    <textarea
                        name="content"
                        placeholder="Nhập đánh giá của bạn..."
                        value={newReview.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <div className="rating-select">
                        <label>Đánh giá: </label>
                        <select
                            name="rating"
                            value={newReview.rating}
                            onChange={handleChange}
                        >
                            {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>
                                    {'★'.repeat(star)}{'☆'.repeat(5-star)} ({star} sao)
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleSubmit} className="submit-review-btn">
                        Gửi đánh giá
                    </button>
                </div>
            )}

            <div className="reviews-container">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={review.id || index} className="review-card">
                            <img
                                src={review.userAvatar || '/default-avatar.jpg'}
                                alt={review.userName}
                                className="avatar"
                                onError={(e) => {
                                    e.target.src = '/default-avatar.jpg';
                                }}
                            />
                            <h3 className="customer-name">{review.userName}</h3>
                            <p className="customer-review">"{review.content}"</p>
                            <div className="customer-rating">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            {review.createdAt && (
                                <div className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                    </div>
                )}
            </div>

            {!isAuthenticated && (
                <div className="login-prompt">
                    <p>Vui lòng <a href="/login">đăng nhập</a> để viết đánh giá</p>
                </div>
            )}
        </div>
    );
};

export default CustomerReviews;