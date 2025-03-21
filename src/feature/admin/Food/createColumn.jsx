import { Button, Space } from "antd";

export const createColumns = (setEditItem, setIsModalVisible, handleDelete) => [
  {
    title: "Hình ảnh",
    dataIndex: "imageUrl",
    key: "imageUrl",
    render: (imageUrl) => {
      // Xử lý đường dẫn ảnh
      const displayImage = imageUrl
        ? imageUrl.startsWith("http")
          ? imageUrl // Ảnh từ URL bên ngoài (nếu có)
          : imageUrl // Ảnh từ public (đã có dạng /images/food1.jpg)
        : "/images/default-food.jpg"; // Ảnh mặc định nếu không có imageUrl

      return (
        <img
          src={displayImage}
          alt="Hình món ăn"
          style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 10 }}
          onError={(e) => {
            console.log(`Không tải được ảnh: ${displayImage}`);
            e.target.src = "/images/default-food.jpg"; // Ảnh mặc định nếu lỗi
          }}
        />
      );
    },
  },
  {
    title: "Tên món",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price) => (price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`),
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setEditItem(record);
            setIsModalVisible(true);
          }}
        >
          Sửa
        </Button>
        <Button danger onClick={() => handleDelete(record)}>
          Xóa
        </Button>
      </Space>
    ),
  },
];