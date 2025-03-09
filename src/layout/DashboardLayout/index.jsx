import { Outlet } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';

const DashboardLayout = () => {
    return (
        <div>
            <HeaderComponent />
            <div
                style={{ padding: '1px', minHeight: 'calc(100vh - 120px)' }}
            >
                <Outlet />
            </div>
            <FooterComponent />
        </div>
    );
};

export default DashboardLayout;