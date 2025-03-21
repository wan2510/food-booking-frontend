import { Form, Input, Button } from 'antd';
import { FaEnvelope, FaKey, FaUser, FaLock } from 'react-icons/fa';

export const ForgotPassForm = ({ handleResetPassword }) => {
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