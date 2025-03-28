import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Card, Avatar, Modal, message } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  LockOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Điền dữ liệu vào form
      form.setFieldsValue({
        email: userData.email || '',
        fullName: userData.fullName || '',
        phone: userData.phone || '',
      });
    } else {
      message.error('Không tìm thấy thông tin người dùng');
    }

    // (Nếu có) Lấy thông tin đặt bàn từ localStorage (ví dụ Quick Booking)
    const bookingData = localStorage.getItem('lastBookingData');
    if (bookingData) {
      try {
        setBookingInfo(JSON.parse(bookingData));
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
  }, [form]);

  const handleEditToggle = async () => {
    if (editing) {
      // Khi nhấn "Lưu", gửi PUT request cập nhật thông tin
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.warning("Vui lòng đăng nhập để cập nhật thông tin");
        navigate("/login");
        return;
      }
      try {
        const values = form.getFieldsValue();
        const updateProfileRequest = {
          fullName: values.fullName,
          phone: values.phone,
        };
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updateProfileRequest),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        message.success("Thông tin của bạn đã được cập nhật thành công!");
        setEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        message.error("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!");
      }
    } else {
      setEditing(true);
    }
  };

  // Xử lý upload avatar
  const handleChangeAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning("Vui lòng đăng nhập để thay đổi ảnh đại diện");
      navigate("/login");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);
  
      const response = await fetch("http://localhost:8080/api/user/profile/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("Ảnh đại diện đã được cập nhật!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Có lỗi xảy ra khi cập nhật ảnh đại diện. Vui lòng thử lại!");
    }
  };  

  const handleCart = () => {
    navigate("/cart");
  };

  const openBookingModal = () => {
    if (bookingInfo) {
      setIsBookingModalVisible(true);
    } else {
      message.info("Bạn chưa đặt bàn nào");
    }
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalVisible(true);
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  const handleBookingModalClose = () => {
    setIsBookingModalVisible(false);
  };

  const handleCancelBooking = () => {
    Modal.confirm({
      title: "Xác nhận hủy đặt bàn",
      content: "Bạn có chắc chắn muốn hủy đặt bàn không?",
      okText: "Có, hủy",
      cancelText: "Không",
      onOk: () => {
        localStorage.removeItem("lastBookingData");
        setBookingInfo(null);
        message.success("Đặt bàn đã được hủy");
        setIsBookingModalVisible(false);
      },
    });
  };

  const handlePasswordUpdate = async (values) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning("Vui lòng đăng nhập để đổi mật khẩu");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      message.success("Mật khẩu của bạn đã được cập nhật thành công!");
      setIsChangePasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại!");
    }
  };

  return (
    <div className="user-profile-container">
      <Card title="Tài khoản của tôi" className="profile-card">
        <div className="profile-header">
          <Avatar
            size={100}
            src={user?.avatarUrl ? user.avatarUrl : null}
            icon={!user?.avatarUrl && <UserOutlined />}
            style={{ marginBottom: 10 }}
          />
          <h2>{user?.fullName}</h2>
          <p>{user?.role}</p>
          <Button icon={<UploadOutlined />} onClick={handleChangeAvatarClick}>
            Thay đổi ảnh
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <Form form={form} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input disabled={!editing} />
          </Form.Item>
          <div className="profile-actions">
            <Button type="primary" onClick={handleEditToggle}>
              {editing ? 'Lưu' : 'Chỉnh sửa thông tin'}
            </Button>
            <Button icon={<ShoppingCartOutlined />} onClick={handleCart}>
              Giỏ hàng
            </Button>
            <Button icon={<BookOutlined />} onClick={openBookingModal}>
              Thông tin đặt bàn
            </Button>
            <Button icon={<LockOutlined />} onClick={openChangePasswordModal}>
              Đổi mật khẩu
            </Button>
            {(user?.role === 'admin' || user?.role === 'ROLE_ADMIN') && (
              <Button type="dashed" onClick={handleAdminPanel}>
                Admin Panel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      {/* Modal hiển thị thông tin đặt bàn */}
      <Modal
        title="Thông tin đặt bàn của bạn"
        open={isBookingModalVisible}
        onCancel={handleBookingModalClose}
        footer={[
          <Button key="cancelBooking" danger onClick={handleCancelBooking}>
            Hủy đặt bàn
          </Button>,
          <Button key="close" type="primary" onClick={handleBookingModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {bookingInfo ? (
          <div className="booking-info">
            <p>
              <strong>Ngày:</strong> {bookingInfo.date}
            </p>
            <p>
              <strong>Giờ:</strong> {bookingInfo.time}
            </p>
            <p>
              <strong>Số lượng khách:</strong> {bookingInfo.guests}
            </p>
            <p>
              <strong>Loại bàn:</strong> {bookingInfo.tableType}
            </p>
            {bookingInfo.occasion && (
              <p>
                <strong>Dịp:</strong> {bookingInfo.occasion}
              </p>
            )}
            {bookingInfo.note && (
              <p>
                <strong>Ghi chú:</strong> {bookingInfo.note}
              </p>
            )}
          </div>
        ) : (
          <p>Không có thông tin đặt bàn</p>
        )}
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={isChangePasswordModalVisible}
        onCancel={() => {
          setIsChangePasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;