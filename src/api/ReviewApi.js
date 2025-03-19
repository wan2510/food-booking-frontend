// Hàm lấy danh sách đánh giá từ localStorage
export const getReviews = () => {
    try {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        return reviews;
    } catch (error) {
        console.error('Error getting reviews:', error);
        return [];
    }
};

// Hàm thêm đánh giá mới
export const addReview = (review) => {
    try {
        const reviews = getReviews();
        const newReview = {
            ...review,
            id: Date.now(), // Tạo ID duy nhất
            createdAt: new Date().toISOString()
        };
        reviews.unshift(newReview); // Thêm vào đầu mảng
        localStorage.setItem('reviews', JSON.stringify(reviews));
        return newReview;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};
