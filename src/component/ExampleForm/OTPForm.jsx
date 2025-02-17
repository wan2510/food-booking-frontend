import { Form, Input, Button } from 'antd';
import { FaEnvelope, FaKey, FaUser, FaLock } from 'react-icons/fa';

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