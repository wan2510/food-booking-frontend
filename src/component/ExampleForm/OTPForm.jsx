import { Form, Input, Button } from 'antd';
import { FaKey } from 'react-icons/fa';

export const OTPForm = ({ handleOtpSubmit }) => {
    return (
        <Form onFinish={handleOtpSubmit}>
            <Form.Item 
                name="otp"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập mã OTP!' },
                    { pattern: /^\d{6}$/, message: 'Mã OTP phải có 6 chữ số!' },
                    { whitespace: true, message: 'Mã OTP không được chứa khoảng trắng!' }
                ]}
            >
                <Input 
                    placeholder="Nhập mã OTP" 
                    prefix={<FaKey />}
                    maxLength={6}
                    type="number"
                    autoComplete="one-time-code"
                />
            </Form.Item>
            <Button className="submit-button" type="primary" htmlType="submit">
                Xác nhận OTP
            </Button>
        </Form>
    );
};