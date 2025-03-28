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

// Hàm lấy danh sách đặt bàn từ localStorage (dùng cho cache nếu cần)
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
        // Tạo payload chỉ với các trường cần thiết
        const newBooking = {
            name: booking.name,
            phone: booking.phone,
            guests: booking.guests,
            date: booking.date,
            time: booking.time,
            note: booking.note,
            tableType: booking.tableType,
            occasion: booking.occasion
        };

        // Gửi request POST đến server
        const token = getToken();
        const response = await fetch('http://localhost:8080/api/booking', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(newBooking)
        });

        if (!response.ok) {
            throw new Error('Failed to save booking to server');
        }

        const savedBooking = await response.json();

        // Lưu lại thông tin đặt bàn mới vào localStorage (nếu cần sử dụng cho Quick Booking)
        const bookings = getBookings();
        bookings.unshift(savedBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        return savedBooking;
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
            const response = await fetch(`http://localhost:8080/api/booking/${bookingId}/status`, {
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
            const response = await fetch(`http://localhost:8080/api/booking/${bookingId}`, {
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
