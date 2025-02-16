import "./login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-left">
                    <img src="your-image-url.jpg" alt="Login Image" className="login-img" />
                </div>
                <div className="login-right">
                    <h2>Member Login</h2>
                    <form>
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input type="email" id="email" name="email" placeholder="Email" />
                        </div>
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input type="password" id="password" name="password" placeholder="Password" />
                        </div>
                        <button type="submit">LOGIN</button>
                    </form>
                    <div className="extra-links">
                        Forgot <a href="#">Username?</a> / <a href="#">Password?</a>
                    </div>
                    <div className="extra-links">
                        <a href="#">Create your Account →</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
