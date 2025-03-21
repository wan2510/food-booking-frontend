import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

function Contact() {
  const form = useRef();
  const [status, setStatus] = useState(null);
  
  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');

    // Đã cập nhật với thông tin thật
    emailjs.sendForm(
      'service_bos99g9', 
      'template_s5b2k6j', 
      form.current, 
      'bkXxF_Z7J7OG_2V1d'
    )
      .then((result) => {
        console.log(result.text);
        setStatus('success');
        form.current.reset();
      }, (error) => {
        console.log(error.text);
        setStatus('error');
      });
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h2>Liên hệ với chúng tôi</h2>
        <p>Có câu hỏi hoặc đề xuất? Hãy gửi cho chúng tôi một tin nhắn.</p>
        
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div className="form-group">
            <label htmlFor="user_name">Họ tên</label>
            <input type="text" name="name" id="user_name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="user_email">Email</label>
            <input type="email" name="email" id="user_email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Tin nhắn</label>
            <textarea name="message" id="message" rows="5" required></textarea>
          </div>
          
          <button type="submit" className="submit-btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
          
          {status === 'success' && <p className="success-message">Tin nhắn đã được gửi thành công!</p>}
          {status === 'error' && <p className="error-message">Có lỗi xảy ra. Vui lòng thử lại.</p>}
        </form>
      </div>
      
      <div className="contact-info">
        <h3>Thông tin liên hệ</h3>
        <div className="info-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>163 Thôn 3, Xã Thạch Hòa, Huyện Thạch Thất, TP. Hà Nội</span>
        </div>
        <div className="info-item">
          <i className="fas fa-phone"></i>
          <span>+84 393 095 515</span>
        </div>
        <div className="info-item">
          <i className="fas fa-envelope"></i>
          <span>hucauvn37@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

export default Contact;
