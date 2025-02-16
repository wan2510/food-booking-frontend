import { Button, Flex, Form, Input } from 'antd';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export const LoginForm = () => {
    const handleSubmitForm = () => {
        console.log('TEST');
    };

    return (
        <Form onFinish={handleSubmitForm}>
            <Form.Item name={'mail'}>
                <Input placeholder={'Địa chỉ email'} prefix={<FaEnvelope />} />
            </Form.Item>
            <Form.Item name={'password'}>
                <Input placeholder={'Mật khẩu'} prefix={<FaLock />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">
                Đăng nhập
            </Button>
        </Form>
    );
};
