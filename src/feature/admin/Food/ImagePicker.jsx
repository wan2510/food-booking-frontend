import React from "react";
import { Modal } from "antd";

// Danh sách ảnh từ thư mục public
const images = [
  "/images/food1.jpg",
  "/images/food2.jpg",
  "/images/food3.jpg",
  "/images/food4.jpg",
  "/images/food5.jpg",
  "/images/food6.jpg",
  "/images/food7.jpg",
  "/images/food8.jpg",
  "/images/food9.jpg",
  "/images/food10.jpg",
];

const ImagePicker = ({ visible, onClose, onSelect }) => {
  const handleImageSelect = (image) => {
    onSelect(image); // Gọi hàm onSelect để truyền đường dẫn ảnh
    onClose(); // Đóng modal sau khi chọn ảnh
  };

  return (
    <Modal
      title="Chọn Hình Ảnh"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1600}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // Sử dụng grid để hiển thị 5 cột
          gap: 10,
          padding: 10,
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`food-${index}`}
            style={{
              width: "100%", // Chiếm toàn bộ chiều rộng của ô grid
              height: 180,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: 10,
              border: "2px solid transparent",
              transition: "border 0.3s",
            }}
            onClick={() => handleImageSelect(image)}
            onError={(e) => {
              console.log(`Không tải được ảnh: ${image}`);
              e.target.src = "/images/default-food.jpg"; // Ảnh mặc định nếu lỗi
            }}
            onMouseEnter={(e) => (e.target.style.border = "2px solid #1890ff")} // Hover effect
            onMouseLeave={(e) => (e.target.style.border = "2px solid transparent")}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ImagePicker;