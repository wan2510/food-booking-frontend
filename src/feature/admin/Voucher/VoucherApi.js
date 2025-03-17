const API_URL = "http://localhost:8080/api/vouchers";

// Dữ liệu mẫu để test
const mockVouchers = [
  {
    id: 1,
    code: "WELCOME10",
    name: "Chào mừng người mới",
    discount: 10,
    max_discount_value: 50000,
    min_order_value: 200000,
    create_at: "2024-01-01T00:00:00Z",
    expired_at: "2024-12-31T23:59:59Z",
    type: "cho người mới",
    status: "Khả dụng",
  },
  {
    id: 2,
    code: "VIP20",
    name: "Ưu đãi khách VIP",
    discount: 20,
    max_discount_value: 100000,
    min_order_value: 500000,
    create_at: "2024-02-01T00:00:00Z",
    expired_at: "2024-11-30T23:59:59Z",
    type: "cho khách vip",
    status: "Khả dụng",
  },
  {
    id: 3,
    code: "SUMMER15",
    name: "Giảm giá mùa hè",
    discount: 15,
    max_discount_value: 75000,
    min_order_value: 300000,
    create_at: "2024-06-01T00:00:00Z",
    expired_at: "2024-09-30T23:59:59Z",
    type: "cho người dùng",
    status: "Không khả dụng",
  },
];

export const getVouchers = async () => {
  try {
    // Nếu backend không hoạt động, trả về dữ liệu mẫu
    // const response = await fetch(`${API_URL}/getVouchers`);
    // if (!response.ok) throw new Error("Failed to fetch vouchers");
    // return await response.json();
    return mockVouchers; // Sử dụng dữ liệu mẫu để test
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return mockVouchers; // Trả về dữ liệu mẫu nếu có lỗi
  }
};

export const createVoucher = async (voucherData) => {
  try {
    // const response = await fetch(`${API_URL}/addVoucher`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(voucherData),
    // });
    // if (!response.ok) throw new Error("Failed to create voucher");
    // return await response.json();
    const newVoucher = { id: Date.now(), ...voucherData };
    mockVouchers.push(newVoucher); // Thêm vào danh sách mẫu
    return newVoucher;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    // const response = await fetch(`${API_URL}/updateVoucher/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(voucherData),
    // });
    // if (!response.ok) throw new Error("Failed to update voucher");
    // return await response.json();
    const index = mockVouchers.findIndex(voucher => voucher.id === id);
    if (index !== -1) {
      mockVouchers[index] = { ...mockVouchers[index], ...voucherData };
    }
    return mockVouchers[index];
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error;
  }
};