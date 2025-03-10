import { Route, Routes } from 'react-router-dom';
import Home from './feature/dashboard/Home';
import DashboardLayout from './layout/DashboardLayout';
import Food from './feature/admin/Food';
import AdminLayout from './layout/AdminLayout';
import PageNotFound from './feature/pagenotfound';
import Login from './feature/login';
import FoodCategory from './feature/admin/FoodCategory';
import Table from './feature/admin/Table';
import Voucher from './feature/admin/Voucher';
import Register from './feature/register';
import ForgotPassword from './feature/forgotpassword';

export const InitialRouter = () => {
    return (
        <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />
            {/*Register*/}
            <Route path="/register" element={<Register/>}/>
            {/*ForgotPassword*/}
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
{/* Dashboard */}
            <Route path="/" element={<DashboardLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/foodlist" element={<FoodList />} />
                <Route path="/book" element={<Book/>} />
                <Route path="/contact" element={<Contact/>} />
            </Route>


            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="food" element={<Food />} />
                <Route path="food-category" element={<FoodCategory />} />
                <Route path="table" element={<Table />} />
                <Route path="voucher" element={<Voucher />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};
