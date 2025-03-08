import { Form, Input, Button } from 'antd';
import { FaUser, FaLock, FaPhone } from 'react-icons/fa';

export const RegisterForm = ({ handleRegister }) => {
    return (
        <Form onFinish={handleRegister}>
            <Form.Item name={'fullName'}>
                <Input placeholder={'Họ và tên'} prefix={<FaUser />} />
            </Form.Item>
            <Form.Item name={'phone'}>
                <Input placeholder={'Số điện thoại'} prefix={<FaPhone />} />
            </Form.Item>
            <Form.Item name={'password'}>
                <Input.Password placeholder={'Mật khẩu'} prefix={<FaLock />} />
            </Form.Item>
            <Form.Item name={'confirmPassword'}>
                <Input.Password placeholder={'Xác nhận mật khẩu'} prefix={<FaLock />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">Đăng ký</Button>
        </Form>
    );
};