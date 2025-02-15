import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div>
            Day la trang admin
            <Outlet />
        </div>
    );
};

export default AdminLayout;
