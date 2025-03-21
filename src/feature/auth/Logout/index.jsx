import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from '../../../components/Toast/Toast';
import { auth } from '../../../services/auth';

const LogoutContent = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const handleLogout = () => {
            // Xóa toàn bộ dữ liệu đăng nhập
            auth.clearAuthData();
            
            // Thông báo đăng xuất thành công
            addToast('Đã đăng xuất thành công!', 'success');
            
            // Chuyển hướng về trang đăng nhập
            navigate('/login');
        };

        handleLogout();
    }, [navigate, addToast]);

    return (
        <div className="logout-container">
            <div className="loading-spinner"></div>
            <p>Đang đăng xuất...</p>
        </div>
    );
};

const Logout = () => {
    return (
        <ToastProvider>
            <LogoutContent />
        </ToastProvider>
    );
};

export default Logout;
