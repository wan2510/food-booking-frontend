import { Button, Col, Form, Input, Row } from 'antd';
import { FaEnvelope, FaLock, FaUser, FaKey } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './register.css';

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
                    <div className="form-step" style={{ display: step === 1 ? 'block' : 'none' }}>
                        <Form onFinish={handleEmailSubmit}>
                            <Form.Item name={'email'}>
                                <Input placeholder={'Địa chỉ email'} prefix={<FaEnvelope />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Gửi OTP</Button>
                        </Form>
                    </div>
                    <div className="form-step" style={{ display: step === 2 ? 'block' : 'none' }}>
                        <Form onFinish={handleOtpSubmit}>
                            <Form.Item name={'otp'}>
                                <Input placeholder={'Nhập mã OTP'} prefix={<FaKey />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Xác nhận OTP</Button>
                        </Form>
                    </div>
                    <div className="form-step" style={{ display: step === 3 ? 'block' : 'none' }}>
                        <Form onFinish={handleRegister}>
                            <Form.Item name={'fullname'}>
                                <Input placeholder={'Họ và tên'} prefix={<FaUser />} />
                            </Form.Item>
                            <Form.Item name={'password'}>
                                <Input.Password placeholder={'Mật khẩu'} prefix={<FaLock />} />
                            </Form.Item>
                            <Form.Item name={'confirmPassword'}>
                                <Input.Password placeholder={'Xác nhận mật khẩu'} prefix={<FaLock />} />
                            </Form.Item>
                            <Button className="submit-button" htmlType="submit">Đăng ký</Button>
                        </Form>
                    </div>
                    <p className="extra-links">Đã có tài khoản? <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
