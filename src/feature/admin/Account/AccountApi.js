import axios from 'axios';

const API_URL = 'http://your-backend-url/api'; // Thay bằng URL backend của bạn

// Dữ liệu mẫu để test
const mockAccounts = [
  { id: 1, fullName: 'Admin One', phone: '0123456789', email: 'admin1@example.com', password: 'admin123', status: 'Kích hoạt', role: 'Admin', createdDate: '01/03/2024', isLockedRole: true },
  { id: 2, fullName: 'Admin Two', phone: '0987654321', email: 'admin2@example.com', password: 'admin456', status: 'Kích hoạt', role: 'Admin', createdDate: '01/03/2024', isLockedRole: true },
  { id: 3, fullName: 'Staff One', phone: '0123456780', email: 'staff1@example.com', password: 'staff123', status: 'Kích hoạt', role: 'Staff', createdDate: '15/02/2024', isLockedRole: true },
  { id: 4, fullName: 'User One', phone: '0123456781', email: 'user1@example.com', password: 'user123', status: 'Kích hoạt', role: 'Người mới', createdDate: '15/02/2024', isLockedRole: false },
];

export const getAccounts = async () => {
  try {
    // Nếu backend không hoạt động, trả về dữ liệu mẫu
    // const response = await axios.get(`${API_URL}/accounts`);
    // return response.data;
    return mockAccounts; // Sử dụng dữ liệu mẫu để test
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return mockAccounts; // Trả về dữ liệu mẫu nếu có lỗi
  }
};

export const createAccount = async (accountData) => {
  try {
    // const response = await axios.post(`${API_URL}/accounts`, accountData);
    // return response.data;
    const newAccount = { id: Date.now(), ...accountData, createdDate: new Date().toLocaleDateString('vi-VN') };
    mockAccounts.push(newAccount); // Thêm vào danh sách mẫu
    return newAccount;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    // const response = await axios.put(`${API_URL}/accounts/${id}`, accountData);
    // return response.data;
    const index = mockAccounts.findIndex(account => account.id === id);
    if (index !== -1) {
      mockAccounts[index] = { ...mockAccounts[index], ...accountData };
    }
    return mockAccounts[index];
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};