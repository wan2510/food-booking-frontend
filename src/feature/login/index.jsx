import { Button, Col, Flex, Form, Input, Row } from 'antd';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { LoginForm } from './LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import react from '../../assets/icon/react.svg';

const Login = () => {
    return (
        <div className="login-container">
            <Row className="login-box">
                <Col span={15}>
                    <img src={react} alt="Login Image" className="login-img" />
                </Col>
                <Col span={9}>
                    <h2 className='login-form-title'>Đăng nhập</h2>
                    <LoginForm />
                    <Flex className='extra-links' justify='center' gap={20}>
                        <Link to={'#'}>Quên mật khẩu</Link>
                        {'/'}
                        <Link to={'#'}>Đăng ký</Link>
                    </Flex>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
