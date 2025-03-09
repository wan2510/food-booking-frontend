import { Button, Col, Row } from 'antd';
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

    const handleEmailSubmit = (values) => {
        setEmail(values.email);
        console.log('OTP sent to:', values.email);
        setStep(2);
    };

    const handleOtpSubmit = (values) => {
        setOtp(values.otp);
        console.log('OTP Verified:', values.otp);
        setStep(3);
    };

    const handleResetPassword = (values) => {
        console.log('Password reset for:', email);
    };

    return (
        <div className="forgot-password-container">
            <Row className="forgot-password-box" align="middle" justify="center">
                <Col span={12} className="forgot-password-form-container">
                    <h2 className='forgot-password-title'>Quên mật khẩu</h2>
                    {step === 1 && <EmailForm handleEmailSubmit={handleEmailSubmit} />}
                    {step === 2 && <OTPForm handleOtpSubmit={handleOtpSubmit} />}
                    {step === 3 && <ResetPasswordForm handleResetPassword={handleResetPassword} />}
                    <p className="extra-links">Quay lại <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;