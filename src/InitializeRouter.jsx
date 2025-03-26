import { Route, Routes } from 'react-router-dom';
import Home from './feature/dashboard/Home';
import FoodList from './feature/dashboard/FoodList';
import DashboardLayout from './layout/DashboardLayout';
import Food from './feature/admin/Food';
import AdminLayout from './layout/AdminLayout';
import PageNotFound from './feature/pagenotfound';
import Login from './feature/login';
import FoodCategory from './feature/admin/FoodCategory';
import TableManagement from './feature/admin/Table';
import Voucher from './feature/admin/Voucher';
import Bill from './feature/admin/Bill/Bill';
import NotificationPage from './feature/admin/Notification/NotificationPage';



import Register from './feature/register';
import ForgotPassword from './feature/forgotpassword';
import Book from './feature/dashboard/Book';
import Contact from './feature/dashboard/Contact';
import Order from "./feature/dashboard/Order";
import Account from './feature/admin/Account';
import RevenueReport from './feature/admin/Report/RevenueReport';
import CartPage from './feature/dashboard/Cart';
import Orders from './feature/dashboard/Orders';
import Order from './feature/dashboard/Order';
import UserProfile from './feature/dashboard/Profile';
import Checkout from './feature/dashboard/Checkout';


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
                <Route path="/order" element={<Order/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/cart" element={<CartPage/>} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/profile" element={<UserProfile/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/order" element={<Order/>}/>
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="food" element={<Food />} />
                <Route path="food-category" element={<FoodCategory />} />
                <Route path="table" element={<TableManagement />} />
                <Route path="voucher" element={<Voucher />} />

                <Route path="Bill" element={<Bill />} />
                <Route path='Notification' element={<NotificationPage />} />

                <Route path="revenue" element={<RevenueReport/>} />
                <Route path="account" element={<Account/>} />

            </Route>

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};
