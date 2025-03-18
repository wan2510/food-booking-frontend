import React, { useState, useEffect } from "react";
import { message } from 'antd';
import { addBooking } from "../../../api/BookingApi";
import "./BookingForm.css";

const BookingForm = () => {
  const initialFormData = {
    name: "",
    phone: "",
    guests: 1,
    date: "",
    time: "",
    note: "",
    tableType: "standard",
    occasion: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Lấy thông tin user từ localStorage nếu có
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  useEffect(() => {
    // Tự động điền thông tin từ user profile nếu đã đăng nhập
    const user = getUserInfo();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }

    // Lấy thông tin đặt bàn đã lưu (nếu có)
    const savedData = localStorage.getItem("bookingFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error parsing saved booking data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };
      // Lưu tất cả thông tin form vào localStorage
      localStorage.setItem("bookingFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const validateForm = () => {
    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      message.error('Số điện thoại không hợp lệ!');
      return false;
    }

    // Kiểm tra ngày đặt bàn không được là ngày trong quá khứ
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      message.error('Ngày đặt bàn không thể là ngày trong quá khứ!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Thêm thông tin chi tiết vào booking
      const bookingDetails = {
        ...formData,
        status: 'pending',
        user: getUserInfo()?.id,
        createdAt: new Date().toISOString()
      };

      // Lưu booking vào localStorage thông qua BookingApi
      await addBooking(bookingDetails);

      // Hiển thị thông báo thành công
      message.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');

      // Reset form và xóa dữ liệu tạm trong localStorage
      setFormData(initialFormData);
      localStorage.removeItem("bookingFormData");
    } catch (error) {
      console.error('Error submitting booking:', error);
      message.error('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại!');
    }
  };

  return (
    <div className="booking-container">
      <h2>Đặt bàn ngay</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Tên:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Nhập tên của bạn"
            required 
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Nhập số điện thoại"
            required 
          />
        </div>

        <div className="form-group">
          <label>Số lượng khách:</label>
          <input 
            type="number" 
            name="guests" 
            min="1" 
            max="20"
            value={formData.guests} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Loại bàn:</label>
          <select 
            name="tableType" 
            value={formData.tableType} 
            onChange={handleChange}
          >
            <option value="standard">Bàn thường</option>
            <option value="vip">Bàn VIP</option>
            <option value="family">Bàn gia đình</option>
            <option value="outdoor">Bàn ngoài trời</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dịp đặc biệt:</label>
          <select 
            name="occasion" 
            value={formData.occasion} 
            onChange={handleChange}
          >
            <option value="">Không có</option>
            <option value="birthday">Sinh nhật</option>
            <option value="anniversary">Kỷ niệm</option>
            <option value="business">Công việc</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày:</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Giờ:</label>
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Nhập yêu cầu đặc biệt nếu có..."
            rows="3"
          />
        </div>

        <button type="submit" className="submit-btn">Xác nhận đặt bàn</button>
      </form>
    </div>
  );
};

export default BookingForm;
