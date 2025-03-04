import React, { useState } from "react";
import "./bookingForm.css";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: 1,
    date: "",
    time: "",
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
    alert("Đặt bàn thành công!\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="booking-container">
      <h2>Đặt bàn ngay</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <label>Tên:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Số điện thoại:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Số lượng khách:</label>
        <input type="number" name="guests" min="1" value={formData.guests} onChange={handleChange} required />

        <label>Ngày:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Giờ:</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />

        <button type="submit">Xác nhận đặt bàn</button>
      </form>
    </div>
  );
};

export default BookingForm;