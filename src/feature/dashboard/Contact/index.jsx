import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Tin nhắn của bạn đã được gửi!\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="contact-container">
      <h2>Liên hệ với chúng tôi</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Tên:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Nội dung:</label>
        <textarea name="message" value={formData.message} onChange={handleChange} required />

        <button type="submit">Gửi tin nhắn</button>
      </form>
      <div className="contact-info">
        <h3>Thông tin liên hệ</h3>
        <p><strong>Địa chỉ:</strong> 163 thôn 3, Thạch Hòa, Thạch Thất, Hà Nội, Việt Nam</p>
        <p><strong>Điện thoại:</strong> 0393095515</p>
        <p><strong>Email:</strong> contact@restaurant.com</p>
      </div>
    </div>
  );
};

export default ContactForm;