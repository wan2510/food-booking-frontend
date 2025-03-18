import { message } from "antd";

// URL API (dùng mock cho test)
const API_URL = "http://localhost:8080/api/order";

// Dữ liệu mẫu để test
const mockTables = [
  { id: 1, number: 1, max_number_human: 4 },
  { id: 2, number: 2, max_number_human: 6 },
  { id: 3, number: 3, max_number_human: 2 },
];

const mockMenuItems = [
  { id: 1, name: "Pizza", price: 150000, image: "", category: "Fast Food" },
  { id: 2, name: "Burger", price: 80000, image: "", category: "Fast Food" },
  { id: 3, name: "Sushi", price: 200000, image: "", category: "Japanese" },
];

const mockFoodCategories = [
  { id: "Fast Food", name: "Fast Food" },
  { id: "Japanese", name: "Japanese" },
  { id: "Drinks", name: "Drinks" },
  { id: "Desserts", name: "Desserts" },
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
};

// Subscribe để theo dõi thay đổi state
const subscribers = new Set();

export const subscribe = (listener) => {
  subscribers.add(listener);
  listener(orderState);
  return () => subscribers.delete(listener);
};

export const setState = (newState) => {
  orderState = { ...orderState, ...newState };
  console.log("Updated orderState:", { ...orderState }); // Debug log chi tiết
  subscribers.forEach((listener) => listener(orderState));
};

// Lấy danh sách bàn
export const getTables = async () => {
  try {
    return [...mockTables];
  } catch (error) {
    console.error("Error fetching tables:", error);
    return mockTables;
  }
};

// Lấy danh sách món ăn
export const getMenuItems = async () => {
  try {
    return [...mockMenuItems];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return mockMenuItems;
  }
};

// Lấy danh sách danh mục
export const getFoodCategories = async () => {
  try {
    return [...mockFoodCategories];
  } catch (error) {
    console.error("Error fetching food categories:", error);
    return mockFoodCategories;
  }
};

// Lấy danh sách voucher
export const getVouchers = async () => {
  try {
    return [...mockVouchers];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return mockVouchers;
  }
};

// Thêm món vào hóa đơn
export const addToBill = async (item) => {
  try {
    if (!item || !item.id || !item.name || !item.price || !item.category) {
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

// Chọn voucher
export const setSelectedVoucher = async (voucherId) => {
  try {
    const voucher = mockVouchers.find((v) => v.id === voucherId);
    const totalPrice = getTotalPrice();
    console.log("Attempting to set voucher:", voucherId, "Voucher found:", voucher, "Total price:", totalPrice); // Debug log
    if (voucher && totalPrice < voucher.min_order_value) {
      message.warning(`Đơn hàng phải từ ${voucher.min_order_value.toLocaleString()} VND để áp dụng voucher này!`);
      setState({ selectedVoucher: null });
      return { success: false, selectedVoucher: null };
    }
    setState({ selectedVoucher: voucher || null });
    console.log("Voucher set successfully:", orderState.selectedVoucher); // Debug log
    return { success: true, selectedVoucher: voucher || null };
  } catch (error) {
    console.error("Error setting voucher:", error);
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
  const total = orderState.bill.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("Calculated total price:", total); // Debug log
  return total;
};

// Tính giảm giá
export const getDiscount = () => {
  const totalPrice = getTotalPrice();
  console.log("Checking discount - Total price:", totalPrice, "Selected voucher:", orderState.selectedVoucher); // Debug log
  if (orderState.selectedVoucher && totalPrice >= orderState.selectedVoucher.min_order_value) {
    const discountAmount = (totalPrice * orderState.selectedVoucher.discount) / 100;
    const discount = Math.min(discountAmount, orderState.selectedVoucher.max_discount_value);
    console.log("Discount calculated:", discount); // Debug log
    return discount;
  }
  console.log("No discount applied - Reason: Voucher null or total below min_order_value"); // Debug log
  return 0;
};

// Tính giá cuối cùng
export const getFinalPrice = () => {
  const final = getTotalPrice() - getDiscount();
  console.log("Calculated final price:", final); // Debug log
  return final;
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

// Xóa toàn bộ đơn hàng
export const clearOrder = async () => {
  try {
    setState({
      bill: [],
      selectedTable: null,
      selectedVoucher: null,
      paymentMethod: "Tiền mặt",
      cashReceived: 0,
    });
    return { success: true };
  } catch (error) {
    console.error("Error clearing order:", error);
    return { success: false, error };
  }
};

// Lấy state hiện tại
export const getState = () => {
  return { ...orderState };
};