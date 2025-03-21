import React, { useState, useEffect } from "react";
import { Button, Table, Input, Row, Col, message, Modal } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddEditModal from "./AddEditModal";
import { createColumns } from "./createColumn";
import "./food.css";

const API_URL = "http://localhost:8080/api/food";

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi tải dữ liệu: ${response.status} - ${errorText || "Không có thông tin lỗi"}`);
      }
      const data = await response.json();
      console.log("Dữ liệu từ BE:", data);
      setFoods(data);
      message.success("Tải dữ liệu thành công!");
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      message.error(`Không thể lấy dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (foodData) => {
    if (!foodData.imageUrl) {
      message.error("Vui lòng chọn ảnh cho món ăn!");
      return;
    }
  
    try {
      let response;
      const payload = {
        name: foodData.name,
        description: foodData.description,
        price: parseFloat(Number(foodData.price)).toFixed(2), // Chuỗi: "123.45"
        imageUrl: foodData.imageUrl,
      };
  
      console.log("API_URL:", API_URL);
      console.log("Payload gửi lên:", JSON.stringify(payload));
  
      if (editItem && editItem.uuid) {
        // Cập nhật món ăn
        response = await fetch(`${API_URL}/${editItem.uuid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Thêm món ăn mới
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Phản hồi lỗi từ server:", errorText);
        throw new Error(`Lỗi khi lưu: ${response.status} - ${errorText || "Không có thông tin lỗi"}`);
      }
  
      const result = await response.json();
      console.log("Kết quả từ BE:", result);
  
      message.success(editItem ? "Cập nhật thành công!" : "Thêm món ăn thành công!");
      await fetchFoods();
      setIsModalVisible(false);
      setEditItem(null);
    } catch (error) {
      console.error("Lỗi khi lưu món ăn:", error);
      message.error(`Không thể lưu món ăn: ${error.message}`);
    }
  };

  const handleDelete = (record) => {
    if (!record.uuid) {
      message.error("Lỗi: Không tìm thấy UUID của món ăn!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa món ăn "${record.name}" khỏi danh sách không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await fetch(`${API_URL}/${record.uuid}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi khi xóa: ${response.status} - ${errorText || "Không có thông tin lỗi"}`);
          }

          message.success("Xóa món thành công!");
          await fetchFoods();
        } catch (error) {
          console.error("Lỗi API:", error);
          message.error(`Không thể xóa món ăn: ${error.message}`);
        }
      },
      onCancel: () => {
        console.log("Hủy xóa");
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (food.description &&
        food.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16, marginTop: 16 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditItem(null);
              setIsModalVisible(true);
            }}
            style={{ fontSize: "16px", padding: "8px 16px" }}
          >
            Thêm Món
          </Button>
        </Col>
        <Col>
          <Input
            placeholder="Tìm món ăn..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250, borderRadius: "8px", padding: "8px" }}
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          />
        </Col>
      </Row>

      <Table
        columns={createColumns(setEditItem, setIsModalVisible, handleDelete)}
        dataSource={filteredFoods}
        rowKey="uuid"
        className="food-table"
        loading={loading}
      />

      <AddEditModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
        editItem={editItem}
      />
    </div>
  );
};

export default Food;