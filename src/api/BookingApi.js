// Hàm lấy token từ localStorage
const getToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Hàm lấy danh sách đặt bàn từ localStorage
export const getBookings = () => {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        return bookings;
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
};

// Hàm thêm đặt bàn mới
export const addBooking = async (booking) => {
    try {
        // Lưu vào localStorage trước
        const bookings = getBookings();
        const newBooking = {
            ...booking,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'pending' // pending, confirmed, cancelled
        };
        bookings.unshift(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Gửi lên server nếu có token
        const token = getToken();
        if (token) {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newBooking)
            });

            if (!response.ok) {
                throw new Error('Failed to save booking to server');
            }

            const savedBooking = await response.json();
            // Cập nhật lại ID từ server trong localStorage
            const updatedBookings = bookings.map(b => 
                b.id === newBooking.id ? { ...b, id: savedBooking.id } : b
            );
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            return savedBooking;
        }

        return newBooking;
    } catch (error) {
        console.error('Error adding booking:', error);
        throw error;
    }
};

// Hàm cập nhật trạng thái đặt bàn
export const updateBookingStatus = async (bookingId, status) => {
    try {
        // Cập nhật trong localStorage
        const bookings = getBookings();
        const updatedBookings = bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status } : booking
        );
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));

        // Cập nhật lên server nếu có token
        const token = getToken();
        if (token) {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status on server');
            }
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
};

// Hàm xóa đặt bàn
export const deleteBooking = async (bookingId) => {
    try {
        // Xóa trong localStorage
        const bookings = getBookings();
        const filteredBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));

        // Xóa trên server nếu có token
        const token = getToken();
        if (token) {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete booking on server');
            }
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};
