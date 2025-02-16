import { Link } from 'react-router-dom';

export const BookingNotification = ({ bookingName }) => {
    return (
        <Link to={'#'}>
            <p>Khách hàng {bookingName} vừa đặt bàn</p>
            <p>Vào xem ngay</p>
        </Link>
    );
};
