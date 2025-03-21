import { message } from "antd";

// URL API
const API_URL = "http://localhost:8080/api";

const foodHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const mockTables = [
  { id: 1, number: 1, max_number_human: 4 },
  { id: 2, number: 2, max_number_human: 6 },
  { id: 3, number: 3, max_number_human: 2 },
  { id: 4, number: 4, max_number_human: 8 },
  { id: 5, number: 5, max_number_human: 4 },
];

const mockVouchers = [
  { id: 1, code: "WELCOME10", name: "Chào mừng người mới", discount: 10, max_discount_value: 50000, min_order_value: 200000, create_at: "2024-01-01T00:00:00Z", expired_at: "2024-12-31T23:59:59Z", type: "cho người mới", status: "Khả dụng" },
  { id: 2, code: "VIP20", name: "Ưu đãi khách VIP", discount: 20, max_discount_value: 100000, min_order_value: 500000, create_at: "2024-02-01T00:00:00Z", expired_at: "2024-11-30T23:59:59Z", type: "cho khách vip", status: "Khả dụng" },
  { id: 3, code: "SUMMER15", name: "Giảm giá mùa hè", discount: 15, max_discount_value: 75000, min_order_value: 300000, create_at: "2024-06-01T00:00:00Z", expired_at: "2024-09-30T23:59:59Z", type: "cho người dùng", status: "Không khả dụng" },
];

let orderState = {
  bill: [],
  selectedTable: null,
  selectedVoucher: null,
  paymentMethod: "Tiền mặt",
  cashReceived: 0,
  isPaymentModalOpen: false,
};

const subscribers = new Set();

export const subscribe = (listener) => {
  subscribers.add(listener);
  listener(orderState);
  return () => subscribers.delete(listener);
};

export const setState = (newState) => {
  orderState = { ...orderState, ...newState };
  subscribers.forEach((listener) => listener(orderState));
};

export const getState = () => {
  return { ...orderState };
};

// Lấy danh sách bàn
export const getTables = async () => {
  try {
    const response = await fetch(`${API_URL}/getAllTables`);
    if (!response.ok) throw new Error("Failed to fetch tables");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tables:", error);
    message.error("Không thể tải danh sách bàn!");
    return [...mockTables]; // Dữ liệu tạm thời nếu API lỗi
  }
};

// Lấy danh sách món ăn từ API /api/food
export const getMenuItems = async () => {
  try {
    const response = await fetch(`${API_URL}/food`, {
      method: 'GET',
      headers: foodHeaders,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tải danh sách món ăn');
    }

    const data = await response.json();
    // Ánh xạ dữ liệu từ API /api/food để phù hợp với các component
    return data.map(item => ({
      id: item.uuid, // Dùng uuid làm id
      name: item.name,
      price: item.price,
      image: item.imageUrl || "", // Dùng imageUrl làm image
      category: item.tag || "Không có danh mục", // Dùng tag làm category
      description: item.description || "Không có mô tả", // Thêm description nếu cần
    }));
  } catch (error) {
    console.error('Error fetching foods:', error);
    message.error('Không thể tải danh sách món ăn!');
    throw error; 
  }
};

// Lấy danh sách danh mục
export const getFoodCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/category`);
    if (!response.ok) throw new Error("Failed to fetch food categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching food categories:", error);
    message.error("Không thể tải danh sách danh mục!");
    return [...mockFoodCategories];
  }
};

// Lấy danh sách voucher
export const getVouchers = async () => {
  try {
    const response = await fetch(`${API_URL}/getVouchers`);
    if (!response.ok) throw new Error("Failed to fetch vouchers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    message.error("Không thể tải danh sách voucher!");
    return [...mockVouchers]; // Dữ liệu tạm thời nếu API lỗi
  }
};

// Thêm món vào hóa đơn
export const addToBill = async (item) => {
  try {
    if (!item || !item.id || !item.name || !item.price) {
      message.error("Dữ liệu món ăn không hợp lệ!");
      return { success: false };
    }
    const existingItem = orderState.bill.find((i) => i.id === item.id);
    const newBill = existingItem
      ? orderState.bill.map((i) =>
          i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, 50) } : i
        )
      : [...orderState.bill, { ...item, quantity: 1 }];
    setState({ bill: newBill });
    return { success: true, bill: newBill };
  } catch (error) {
    console.error("Error adding to bill:", error);
    return { success: false, error };
  }
};

// Cập nhật số lượng hoặc xóa món
export const updateItem = async (id, quantity) => {
  try {
    if (quantity < 0) {
      message.error("Số lượng không thể âm!");
      return { success: false };
    }
    if (quantity > 50) {
      message.error("Số lượng tối đa cho mỗi món là 50!");
      return { success: false };
    }
    const newBill = quantity === 0
      ? orderState.bill.filter((item) => item.id !== id)
      : orderState.bill.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
    setState({ bill: newBill });
    return { success: true, bill: newBill };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error };
  }
};

// Chọn bàn
export const setSelectedTable = async (tableNumber) => {
  try {
    const table = mockTables.find((t) => t.number === tableNumber);
    if (table) {
      setState({ selectedTable: table.number });
      return { success: true, selectedTable: table.number };
    } else {
      message.error(`Không tìm thấy bàn số ${tableNumber}!`);
      return { success: false };
    }
  } catch (error) {
    console.error("Error setting table:", error);
    return { success: false, error };
  }
};

// Chọn phương thức thanh toán
export const setPaymentMethod = async (method) => {
  try {
    if (method !== "Tiền mặt" && method !== "Chuyển khoản") {
      message.error("Phương thức thanh toán không hợp lệ!");
      return { success: false };
    }
    setState({ paymentMethod: method });
    return { success: true, paymentMethod: method };
  } catch (error) {
    console.error("Error setting payment method:", error);
    return { success: false, error };
  }
};

// Cập nhật số tiền mặt
export const setCashReceived = async (amount) => {
  try {
    if (amount < 0) {
      message.error("Số tiền không thể âm!");
      return { success: false };
    }
    setState({ cashReceived: amount });
    return { success: true, cashReceived: amount };
  } catch (error) {
    console.error("Error setting cash received:", error);
    return { success: false, error };
  }
};

// Tính tổng giá
export const getTotalPrice = () => {
  return orderState.bill.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Tính giảm giá
export const getDiscount = () => {
  const totalPrice = getTotalPrice();
  if (orderState.selectedVoucher && totalPrice >= orderState.selectedVoucher.min_order_value) {
    const discountAmount = (totalPrice * orderState.selectedVoucher.discount) / 100;
    return Math.min(discountAmount, orderState.selectedVoucher.max_discount_value);
  }
  return 0;
};

// Tính giá cuối cùng
export const getFinalPrice = () => {
  return getTotalPrice() - getDiscount();
};

// Chọn voucher
export const setSelectedVoucher = async (voucher) => {
  try {
    const totalPrice = getTotalPrice();
    if (voucher && totalPrice < voucher.min_order_value) {
      message.warning(`Đơn hàng phải từ ${voucher.min_order_value.toLocaleString()} VND để áp dụng voucher này!`);
      setState({ selectedVoucher: null });
      return { success: false, selectedVoucher: null };
    }
    setState({ selectedVoucher: voucher || null });
    return { success: true, selectedVoucher: voucher || null };
  } catch (error) {
    console.error("Error setting voucher:", error);
    return { success: false, error };
  }
};

// Kiểm tra trước khi tạo hóa đơn
export const validateBeforeCreate = async () => {
  if (!orderState.selectedTable) {
    message.error("Vui lòng chọn bàn trước khi tạo hóa đơn!");
    return { success: false };
  }
  if (orderState.bill.length === 0) {
    message.error("Chưa có món nào trong hóa đơn!");
    return { success: false };
  }
  return { success: true };
};