import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { EmailForm} from '../../component/ExampleForm/EmailForm';
import { OTPForm} from '../../component/ExampleForm/OTPForm';
import { RegisterForm} from '../../component/ExampleForm/RegisterForm';
import './register.css';
import { useNavigate } from "react-router-dom";
const Register = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (values) => {
        setEmail(values.email);
        console.log('Gửi yêu cầu gửi OTP đến:', values.email);
    
        try {
            const response = await fetch(`http://localhost:8080/api/email/send-otp/${values.email}`);
            if (response.ok) {
                console.log('OTP đã được gửi!');
                setStep(2);
            } else {
                console.error('Gửi OTP thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi gửi OTP:', error);
        }
    };

    const handleOtpSubmit = async (values) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: values.otp })
            });
    
            const isValid = await response.json();
    
            if (isValid) {
                setOtp(values.otp);
                console.log("OTP Verified:", values.otp);
                setStep(3);
            } else {
                alert("OTP không hợp lệ. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi xác thực OTP:", error);
            alert("Có lỗi xảy ra khi xác thực OTP.");
        }
    };

    const handleRegister = async (values) => {
        console.log("Registering with:", values);
      
        try {
          const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              phone: values.phone,
              fullName: values.fullName,
              password: values.password
            })
          });
      
          if (response.ok) {
            const userData = await response.json();
            console.log("Đăng ký thành công!", userData);
      
            const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: userData.email,
                password: values.password,
              })
            });
      
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              localStorage.setItem("user", JSON.stringify(loginData));
      
              console.log("Auto login thành công!", loginData);
              navigate("/");
            } else {
              console.error("Tự động đăng nhập thất bại");
              alert("Đăng ký thành công, nhưng đăng nhập tự động thất bại. Vui lòng tự đăng nhập!");
            }
          } else {
            const errorData = await response.json();
            console.error("Đăng ký thất bại:", errorData);
            alert(errorData.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("Lỗi khi đăng ký:", error);
          alert("Có lỗi xảy ra khi gửi yêu cầu đăng ký.");
        }
      };
      
    
    

    return (
        <div className="register-container">
            <Row className="register-box" align="middle" justify="center">
                <Col span={12} className="register-form-container">
                    <h2 className='register-form-title'>Đăng ký</h2>
                    {step === 1 && <EmailForm handleEmailSubmit={handleEmailSubmit} />}
                    {step === 2 && <OTPForm handleOtpSubmit={handleOtpSubmit} />}
                    {step === 3 && <RegisterForm handleRegister={handleRegister} />}
                    <p className="extra-links">Đã có tài khoản? <Link to={'/login'}>Đăng nhập</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default Register;