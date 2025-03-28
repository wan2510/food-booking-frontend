import React from "react";
import { Modal } from "antd";


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
    onSelect(image); 
    onClose(); 
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
          gridTemplateColumns: "repeat(5, 1fr)", 
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
              width: "100%", 
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
              e.target.src = "/images/default-food.jpg"; 
            }}
            onMouseEnter={(e) => (e.target.style.border = "2px solid #1890ff")} 
            onMouseLeave={(e) => (e.target.style.border = "2px solid transparent")}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ImagePicker;