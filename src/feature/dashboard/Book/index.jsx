import React, { useState, useEffect } from "react";
import { message } from "antd";
import "./BookingForm.css";

const BASE_URL = "http://localhost:8080";

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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const token = localStorage.getItem("accessToken");
    return token && token.trim() !== "" ? token : null;
  };

  useEffect(() => {
    const fetchTables = async () => {
      const token = getToken();
      if (!token) {
        message.error("Bạn cần đăng nhập để truy cập trang web.");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/table_restaurant`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTableData(data);
        } else if (response.status === 403) {
          message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
        } else {
          message.error("Không lấy được danh sách bàn từ server.");
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("bookingFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const validateForm = () => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      message.error("Số điện thoại không hợp lệ!");
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      message.error("Ngày đặt bàn không thể là ngày trong quá khứ!");
      return false;
    }

    if (formData.time) {
      const [hour] = formData.time.split(":").map(Number);
      if (hour < 10 || hour >= 22) {
        message.error("Giờ đặt bàn phải từ 10:00 đến 22:00!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        // Format the data to save in localStorage
        const bookingData = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            guests: parseInt(formData.guests, 10),
            date: formData.date, // Ensure this is in yyyy-MM-dd format
            time: formData.time, // Ensure this is in HH:mm format
            note: formData.note.trim() || null,
            tableType: formData.tableType,
            occasion: formData.occasion || null,
        };

        console.log("Saving booking data to localStorage:", bookingData); // Debugging log

        // Save booking data to localStorage
        localStorage.setItem("lastBookingData", JSON.stringify(bookingData));
        message.success("Đặt bàn thành công! Hãy kiểm tra thông tin đặt bàn tại trang Thông Tin Cá Nhân.");

        // Reset form
        setFormData(initialFormData);
        localStorage.removeItem("bookingFormData");
    } catch (error) {
        console.error("Error saving booking data:", error);
        message.error("Có lỗi xảy ra khi lưu thông tin đặt bàn. Vui lòng thử lại!");
    }
};

const handleQuickBooking = () => {
    const lastBookingData = localStorage.getItem("lastBookingData");
    if (lastBookingData) {
        try {
            const parsedData = JSON.parse(lastBookingData);
            setFormData(parsedData);
            message.success("Thông tin đặt bàn cũ đã được điền vào.");
        } catch (error) {
            console.error("Error parsing last booking data:", error);
            message.error("Không thể tải thông tin đặt bàn cũ.");
        }
    } else {
        message.info("Không có thông tin đặt bàn cũ.");
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
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Xác nhận đặt bàn
          </button>
          <button
            type="button"
            className="quick-book-btn"
            onClick={handleQuickBooking}
          >
            Đặt lại bàn cũ
          </button>
        </div>
      </form>

      <div className="tables-section">
        <h3>Bàn có sẵn tại quán</h3>
        {loading ? (
          <p>Đang tải danh sách bàn...</p>
        ) : (
          <div className="tables-grid">
            {tableData.map((tb) => (
              <div
                key={tb.id}
                className={`table-card ${tb.status === "available" ? "available" : "unavailable"}`}
              >
                <div className="table-info">
                  <span className="table-number">Bàn {tb.tableNumber}</span>
                  <span className="table-capacity">
                    Sức chứa: {tb.capacity}
                    {tb.bookedGuests > 0 && ` (Đã đặt: ${tb.bookedGuests})`}
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
        )}
      </div>
    </div>
  );
};

export default BookingForm;