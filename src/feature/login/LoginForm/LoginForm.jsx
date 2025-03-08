import { Button, Form, Input, message } from 'antd';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';

export const LoginForm = () => {
    const [form] = useForm();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("Đăng nhập thành công!", userData);

                localStorage.setItem("userToken", userData.token);

                message.success("Đăng nhập thành công!");
                form.resetFields();
                navigate("/");
            } else {
                message.error("Sai email hoặc mật khẩu!");
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            message.error("Có lỗi xảy ra khi đăng nhập.");
        }
    };

    return (
        <Form form={form} onFinish={handleLogin}> 
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
            >
                <Input placeholder="Địa chỉ email" prefix={<FaEnvelope />} />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
            >
                <Input.Password placeholder="Mật khẩu" prefix={<FaLock />} />
            </Form.Item>
            <Button className="submit-button" htmlType="submit" type="primary">
                Đăng nhập
            </Button>
        </Form>
    );
};
