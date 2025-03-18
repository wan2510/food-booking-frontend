import { Button, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { EmailForm} from '../../component/ExampleForm/EmailForm';
import { OTPForm} from '../../component/ExampleForm/OTPForm';
import { ForgotPassForm} from '../../component/ExampleForm/ResetPasswordForm';
import './forgotPassword.css';
import React from "react";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleEmailSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/send-otp', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email,
                    otpType: 'RESET_PASSWORD'
                })
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gửi OTP');
            }

            setEmail(values.email);
            message.success('Mã OTP đã được gửi đến email của bạn');
            setStep(2);
        } catch (error) {
            message.error('Có lỗi xảy ra: ' + error.message);
        }
    };

    const handleOtpSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otp: values.otp
                })
            });

            if (!response.ok) {
                throw new Error('Mã OTP không hợp lệ');
            }

            const isValid = await response.json();
            if (isValid) {
                setOtp(values.otp);
                message.success('Xác thực OTP thành công');
                setStep(3);
            } else {
                throw new Error('Mã OTP không chính xác');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra: ' + error.message);
        }
    };

    const handleResetPassword = async (values) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp,
                    newPassword: values.password
                })
            });

            if (!response.ok) {
                throw new Error('Không thể đặt lại mật khẩu');
            }

            message.success('Đặt lại mật khẩu thành công');
            // Chuyển hướng về trang đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            message.error('Có lỗi xảy ra: ' + error.message);
        }
    };

    return (
        <div className="forgot-password-container">
            <Row className="forgot-password-box" align="middle" justify="center">
                <Col span={12} className="forgot-password-form-container">
                    <h2 className='forgot-password-title'>Quên mật khẩu</h2>
                    {step === 1 && <EmailForm handleEmailSubmit={handleEmailSubmit} />}
                    {step === 2 && <OTPForm handleOtpSubmit={handleOtpSubmit} />}
                    {step === 3 && <ForgotPassForm handleResetPassword={handleResetPassword} />}
                    <p className="extra-links">Quay lại <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;