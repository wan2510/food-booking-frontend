import { message } from "antd";

const API_URL = "http://localhost:8888/api/voucher"; // Cập nhật thành 8888 nếu cần

const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const getVouchers = async () => {
  try {
    const response = await fetch(`${API_URL}/getVouchers`, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch vouchers: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Vouchers received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    message.error("Không thể tải danh sách voucher!");
    throw error;
  }
};

// Phần còn lại của mã giữ nguyên
export const createVoucher = async (voucherData) => {
  try {
    const response = await fetch(`${API_URL}/addVoucher`, {
      method: "POST",
      headers,
      body: JSON.stringify(voucherData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create voucher: ${response.status} - ${errorText}`);
    }
    const newVoucher = await response.json();
    console.log("New voucher created:", newVoucher);
    message.success("Tạo voucher thành công!");
    return newVoucher;
  } catch (error) {
    console.error("Error creating voucher:", error);
    message.error("Tạo voucher thất bại!");
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await fetch(`${API_URL}/updateVoucher/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(voucherData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update voucher: ${response.status} - ${errorText}`);
    }
    const updatedVoucher = await response.json();
    console.log("Updated voucher:", updatedVoucher);
    message.success("Cập nhật voucher thành công!");
    return updatedVoucher;
  } catch (error) {
    console.error("Error updating voucher:", error);
    message.error("Cập nhật voucher thất bại!");
    throw error;
  }
};