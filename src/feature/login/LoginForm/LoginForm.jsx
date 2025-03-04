import { Button, Form, Input, message } from 'antd';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useLogin } from '../hook/useLogin';
import { useForm } from 'antd/es/form/Form';

export const LoginForm = () => {
    const { loginMutate } = useLogin();
    const [form] = useForm();

    const handleSubmitForm = () => {
        loginMutate({
            email: form.getFieldValue('email'),
            password: form.getFieldValue('password'),
        });
    };

    return (
        <Form form={form} onFinish={handleSubmitForm}>
            <Form.Item name={'email'}>
                <Input placeholder={'Địa chỉ email'} prefix={<FaEnvelope />} />
            </Form.Item>
            <Form.Item name={'password'}>
                <Input.Password placeholder={'Mật khẩu'} prefix={<FaLock />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit">
                Đăng nhập
            </Button>
        </Form>
    );
};
