import { Button, Col, Form, Input, Row } from 'antd';
import { FaEnvelope, FaKey, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './forgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    const handleEmailSubmit = (values) => {
        setEmail(values.email);
        console.log('OTP sent to:', values.email);
        setStep(2);
    };

    const handleOtpSubmit = (values) => {
        console.log('OTP Verified:', values.otp);
        setStep(3);
    };

    const handleResetPassword = (values) => {
        console.log('Password reset for:', email, 'New Password:', values.password);
    };

    return (
        <div className="forgot-password-container">
            <Row className="forgot-password-box" align="middle" justify="center">
                <Col span={12} className="forgot-password-form-container">
                    <h2 className='forgot-password-title'>Quên mật khẩu</h2>
                    {step === 1 && (
                        <Form onFinish={handleEmailSubmit}>
                            <Form.Item name={'email'}>
                                <Input placeholder={'Nhập email của bạn'} prefix={<FaEnvelope />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Gửi OTP</Button>
                        </Form>
                    )}
                    {step === 2 && (
                        <Form onFinish={handleOtpSubmit}>
                            <Form.Item name={'otp'}>
                                <Input placeholder={'Nhập mã OTP'} prefix={<FaKey />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Xác nhận OTP</Button>
                        </Form>
                    )}
                    {step === 3 && (
                        <Form onFinish={handleResetPassword}>
                            <Form.Item name={'password'}>
                                <Input.Password placeholder={'Nhập mật khẩu mới'} prefix={<FaLock />} />
                            </Form.Item>
                            <Form.Item name={'confirmPassword'}>
                                <Input.Password placeholder={'Xác nhận mật khẩu mới'} prefix={<FaLock />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Đặt lại mật khẩu</Button>
                        </Form>
                    )}
                    <p className="extra-links">Quay lại <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;
