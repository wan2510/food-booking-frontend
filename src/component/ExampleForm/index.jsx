import { Form, Input, Button } from 'antd';
import { FaEnvelope, FaKey, FaUser, FaLock } from 'react-icons/fa';

export const EmailForm = ({ handleEmailSubmit }) => {
    return (
        <Form onFinish={handleEmailSubmit}>
            <Form.Item name={'email'}>
                <Input placeholder={'Địa chỉ email'} prefix={<FaEnvelope />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">Gửi OTP</Button>
        </Form>
    );
};

export const OTPForm = ({ handleOtpSubmit }) => {
    return (
        <Form onFinish={handleOtpSubmit}>
            <Form.Item name={'otp'}>
                <Input placeholder={'Nhập mã OTP'} prefix={<FaKey />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">Xác nhận OTP</Button>
        </Form>
    );
};

export const RegisterForm = ({ handleRegister }) => {
    return (
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
    );
};

export const ResetPasswordForm = ({ handleResetPassword }) => {
    return (
        <Form onFinish={handleResetPassword}>
            <Form.Item name={'password'}>
                <Input.Password placeholder={'Mật khẩu mới'} prefix={<FaLock />} />
            </Form.Item>
            <Form.Item name={'confirmPassword'}>
                <Input.Password placeholder={'Xác nhận mật khẩu'} prefix={<FaLock />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">Đặt lại mật khẩu</Button>
        </Form>
    );
};
