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


