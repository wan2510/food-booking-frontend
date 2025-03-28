import React, { useState, useEffect } from "react";
import { message } from "antd";
import "./BookingForm.css";

const BASE_URL = "http://localhost:8080";

// Dữ liệu mẫu bàn (nếu API không có)
const sampleTable = [
  { id: 1, tableNumber: "S1", capacity: 4, bookedGuests: 0, status: "available", type: "bàn thường" },
  { id: 2, tableNumber: "S2", capacity: 4, bookedGuests: 1, status: "available", type: "bàn thường" },
  { id: 3, tableNumber: "S3", capacity: 4, bookedGuests: 0, status: "available", type: "bàn thường" },
  { id: 4, tableNumber: "V1", capacity: 4, bookedGuests: 4, status: "unavailable", type: "bàn vip" },
  { id: 5, tableNumber: "V2", capacity: 4, bookedGuests: 0, status: "available", type: "bàn vip" },
  { id: 6, tableNumber: "F1", capacity: 8, bookedGuests: 2, status: "available", type: "bàn gia đình" },
  { id: 7, tableNumber: "F2", capacity: 8, bookedGuests: 0, status: "available", type: "bàn gia đình" },
  { id: 8, tableNumber: "F3", capacity: 8, bookedGuests: 6, status: "unavailable", type: "bàn gia đình" },
  { id: 9, tableNumber: "O1", capacity: 6, bookedGuests: 0, status: "available", type: "bàn ngoài trời" },
  { id: 10, tableNumber: "O2", capacity: 6, bookedGuests: 3, status: "unavailable", type: "bàn ngoài trời" },
  { id: 11, tableNumber: "O3", capacity: 6, bookedGuests: 0, status: "available", type: "bàn ngoài trời" },
];

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
  const [table, setTable] = useState([]); // Danh sách bàn
  const [lastBooking, setLastBooking] = useState(null); // Lưu đặt bàn gần nhất (Quick Booking)

  // Lấy thông tin user từ localStorage nếu có
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };

  // Lấy token (nếu có) để gửi kèm Authorization
  const getToken = () => {
    const token = localStorage.getItem("accessToken");
    return token && token.trim() !== "" ? token : null;
  };

  useEffect(() => {
    // Tự động điền thông tin từ user profile nếu đã đăng nhập
    const user = getUserInfo();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }

    // Lấy thông tin đặt bàn đã lưu (nếu có)
    const savedData = localStorage.getItem("bookingFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
        }));
      } catch (error) {
        console.error("Error parsing saved booking data:", error);
      }
    }

    // Lấy thông tin đặt bàn cuối cùng (Quick Booking)
    const lastData = localStorage.getItem("lastBookingData");
    if (lastData) {
      try {
        setLastBooking(JSON.parse(lastData));
      } catch (error) {
        console.error("Error parsing last booking data:", error);
      }
    }

    // Lấy danh sách bàn từ API (hoặc dùng sample)
    const fetchTable = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/api/tables`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTable(data);
        } else {
          // Nếu lỗi, dùng sample
          setTable(sampleTable);
        }
      } catch (error) {
        console.error("Error fetching table:", error);
        setTable(sampleTable);
      }
    };

    fetchTable();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem("bookingFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const validateForm = () => {
    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      message.error("Số điện thoại không hợp lệ!");
      return false;
    }

    // Kiểm tra ngày đặt bàn không được là ngày trong quá khứ
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      message.error("Ngày đặt bàn không thể là ngày trong quá khứ!");
      return false;
    }

    // Kiểm tra giờ đặt bàn hợp lệ (ví dụ: từ 10:00 đến 22:00)
    if (formData.time) {
      const [hour] = formData.time.split(":").map(Number);
      if (hour < 10 || hour >= 22) {
        message.error("Giờ đặt bàn phải từ 10:00 đến 22:00!");
        return false;
      }
    }

    return true;
  };

  const handleQuickBooking = () => {
    if (lastBooking) {
      setFormData(lastBooking);
      message.info("Đã điền thông tin từ lần đặt bàn gần nhất");
    } else {
      message.info("Chưa có thông tin đặt bàn gần nhất");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const bookingDetails = {
        name: formData.name,
        phone: formData.phone,
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        note: formData.note,
        tableType: formData.tableType,
        occasion: formData.occasion,
      };

      // Gọi API trực tiếp ở đây
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi gửi yêu cầu đến server");
      }

      // Nếu thành công, server trả về JSON
      const savedBooking = await response.json();
      console.log("Booking saved:", savedBooking);

      localStorage.setItem("lastBookingData", JSON.stringify(formData));

      message.success(
        "Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất. Bạn sẽ nhận được thông báo nhắc nhở 1 tiếng trước giờ đặt."
      );

      const bookingDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      const diff = bookingDateTime - now - 60 * 60 * 1000;
      if (diff > 0 && diff < 2 * 60 * 60 * 1000) {
        setTimeout(() => {
          message.info("Nhắc nhở: Bạn sắp có đặt bàn trong 1 tiếng.");
        }, diff);
      }

      setFormData(initialFormData);
      localStorage.removeItem("bookingFormData");
    } catch (error) {
      console.error("Error submitting booking:", error);
      message.error("Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại!");
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
          <select name="tableType" value={formData.tableType} onChange={handleChange}>
            <option value="standard">Bàn thường</option>
            <option value="vip">Bàn VIP</option>
            <option value="family">Bàn gia đình</option>
            <option value="outdoor">Bàn ngoài trời</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dịp đặc biệt:</label>
          <select name="occasion" value={formData.occasion} onChange={handleChange}>
            <option value="">Không có</option>
            <option value="birthday">Sinh nhật</option>
            <option value="anniversary">Kỷ niệm</option>
            <option value="business">Công việc</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Giờ:</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
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

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Xác nhận đặt bàn
          </button>
          <button type="button" className="quick-book-btn" onClick={handleQuickBooking}>
            Đặt lại (Quick Booking)
          </button>
        </div>
      </form>

      <div className="tables-section">
        <h3>Bàn có sẵn tại quán</h3>
        <div className="tables-grid">
          {table.map((tb) => (
            <div
              key={tb.id}
              className={`table-card ${tb.status === "available" ? "available" : "unavailable"}`}
            >
              <div className="table-info">
                <span className="table-number">Bàn {tb.tableNumber}</span>
                <span className="table-capacity">
                  Sức chứa: {tb.capacity} {tb.bookedGuests > 0 && `(Đã đặt: ${tb.bookedGuests})`}
                </span>
                <span className="table-type">Loại: {tb.type}</span>
              </div>
              <div className="table-status">
                {tb.status === "available" ? (
                  <span className="status-indicator green"></span>
                ) : (
                  <span className="status-indicator red"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
