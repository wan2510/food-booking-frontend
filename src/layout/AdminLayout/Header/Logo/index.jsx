import { Link } from 'react-router-dom';
import './logo.css';

export const Logo = () => {
    return (
        <Link to={'/admin'} className="admin-header-logo">
            Nomster
        </Link>
    );
};
