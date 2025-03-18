import { Form, Input, Button } from 'antd';
import { FaUser, FaLock, FaPhone } from 'react-icons/fa';

export const RegisterForm = ({ handleRegister }) => {
    const [form] = Form.useForm();

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject('Vui lòng nhập mật khẩu!');
        }
        if (value.length < 6) {
            return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự!');
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject('Mật khẩu phải có ít nhất 1 chữ hoa!');
        }
        if (!/[0-9]/.test(value)) {
            return Promise.reject('Mật khẩu phải có ít nhất 1 số!');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return Promise.reject('Mật khẩu phải có ít nhất 1 ký tự đặc biệt!');
        }
        return Promise.resolve();
    };

    const validateConfirmPassword = (_, value) => {
        if (!value) {
            return Promise.reject('Vui lòng xác nhận mật khẩu!');
        }
        if (value !== form.getFieldValue('password')) {
            return Promise.reject('Mật khẩu xác nhận không khớp!');
        }
        return Promise.resolve();
    };

    return (
        <Form form={form} onFinish={handleRegister}>
            <Form.Item 
                name="fullName"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập họ tên!' },
                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                    { max: 50, message: 'Họ tên không được quá 50 ký tự!' },
                    { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng!' }
                ]}
            >
                <Input 
                    placeholder="Họ và tên" 
                    prefix={<FaUser />}
                    autoComplete="name"
                />
            </Form.Item>

            <Form.Item 
                name="phone"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ!' },
                    { max: 10, message: 'Số điện thoại không được quá 10 số!' }
                ]}
            >
                <Input 
                    placeholder="Số điện thoại" 
                    prefix={<FaPhone />}
                    type="tel"
                    autoComplete="tel"
                    maxLength={10}
                />
            </Form.Item>

            <Form.Item 
                name="password"
                hasFeedback
                rules={[
                    { validator: validatePassword }
                ]}
            >
                <Input.Password 
                    placeholder="Mật khẩu" 
                    prefix={<FaLock />}
                    autoComplete="new-password"
                />
            </Form.Item>

            <Form.Item 
                name="confirmPassword"
                hasFeedback
                dependencies={['password']}
                rules={[
                    { validator: validateConfirmPassword }
                ]}
            >
                <Input.Password 
                    placeholder="Xác nhận mật khẩu" 
                    prefix={<FaLock />}
                    autoComplete="new-password"
                />
            </Form.Item>

            <Button className="submit-button" type="primary" htmlType="submit">
                Đăng ký
            </Button>
        </Form>
    );
};