import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from '../../../components/Toast/Toast';
import { api } from '../../../services/api';
import { auth } from '../../../services/auth';
import './Login.css';

const LoginContent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            addToast('Vui lòng nhập đầy đủ thông tin!', 'error');
            return;
        }

        setLoading(true);

        try {
            // Đảm bảo xóa dữ liệu đăng nhập cũ trước khi đăng nhập mới
            auth.clearAuthData();
            
            const data = await api.login(email, password);
            
            if (data.token) {
                auth.setAuthData({
                    token: data.token,
                    userUuid: data.userUuid,
                    userEmail: data.email,
                    userName: data.name,
                    userRole: data.role
                });
                
                addToast('Đăng nhập thành công!', 'success');
                navigate('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            addToast('Email hoặc mật khẩu không đúng!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu của bạn"
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`login-btn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                <div className="register-link">
                    <p>
                        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <ToastProvider>
            <LoginContent />
        </ToastProvider>
    );
};

export default Login;
