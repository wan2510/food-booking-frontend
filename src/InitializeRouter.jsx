import { Route, Routes } from 'react-router-dom';
import Home from './feature/dashboard/Home';
import { DashboardLayout } from './layout/DashboardLayout';
import Food from './feature/admin/Food';
import AdminLayout from './layout/AdminLayout';
import PageNotFound from './feature/pagenotfound';
import Login from './feature/login';

export const InitialRouter = () => {
    return (
        <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard */}
            <Route path="/" element={<DashboardLayout />}>
                <Route path="home" element={<Home />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="food" element={<Food />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};
