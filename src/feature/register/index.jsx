import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { EmailForm} from '../../component/ExampleForm/EmailForm';
import { OTPForm} from '../../component/ExampleForm/OTPForm';
import { RegisterForm} from '../../component/ExampleForm/RegisterForm';
import './register.css';
import React from "react";

const Register = () => {
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

    const handleRegister = (values) => {
        console.log('Registering with:', values);
    };

    return (
        <div className="register-container">
            <Row className="register-box" align="middle" justify="center">
                <Col span={12} className="register-form-container">
                    <h2 className='register-form-title'>Đăng ký</h2>
                    {step === 1 && <EmailForm handleEmailSubmit={handleEmailSubmit} />}
                    {step === 2 && <OTPForm handleOtpSubmit={handleOtpSubmit} />}
                    {step === 3 && <RegisterForm handleRegister={handleRegister} />}
                    <p className="extra-links">Đã có tài khoản? <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
