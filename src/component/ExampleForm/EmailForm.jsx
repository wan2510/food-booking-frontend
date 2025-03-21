import { Form, Input, Button } from 'antd';
import { FaEnvelope } from 'react-icons/fa';

export const EmailForm = ({ handleEmailSubmit }) => {
    return (
        <Form onFinish={handleEmailSubmit}>
            <Form.Item 
                name="email"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                      message: 'Email không đúng định dạng!' },
                    { max: 50, message: 'Email không được quá 50 ký tự!' }
                ]}
            >
                <Input 
                    placeholder="Địa chỉ email" 
                    prefix={<FaEnvelope />}
                    autoComplete="email"
                />
            </Form.Item>
            <Button className="submit-button" type="primary" htmlType="submit">
                Gửi OTP
            </Button>
        </Form>
    );
};
