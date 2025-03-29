import { message } from 'antd';

const API_URL = 'http://localhost:8080/api/user';

// Lấy token từ localStorage để gửi lên server
const getAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    return token ? `Bearer ${token}` : null;
};

// Lấy danh sách tài khoản từ server
export const getAccounts = async () => {
    try {
        const token = getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            credentials: 'include',
        };
        if (token) {
            headers['Authorization'] = token;
        }

        const response = await fetch(`${API_URL}/getListUser`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Lỗi tải dữ liệu!');
        }
        const data = await response.json();
        console.log('[API] Dữ liệu tài khoản nhận được:', data);
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error);
        message.error(`Không thể lấy dữ liệu: ${error.message}`);
        throw error;
    }
};

// Tạo tài khoản mới
export const createAccount = async (userData) => {
    try {
        console.log('[API] Dữ liệu gửi để tạo tài khoản:', userData);
        const token = getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            credentials: 'include',
        };
        if (token) {
            headers['Authorization'] = token;
        }

        const response = await fetch(`${API_URL}/addNewUser`, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log('[API] Tài khoản mới tạo:', data);
        message.success('Tạo tài khoản thành công!');
        return data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật tài khoản
export const updateAccount = async (userData) => {
    try {
        console.log('[API 1] Dữ liệu gửi để cập nhật tài khoản:', userData);
        const token = getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            credentials: 'include',
        };
        if (token) {
            headers['Authorization'] = token;
        }

        const response = await fetch(`${API_URL}/updateUser`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        if (userData.status !== 'DELETED') {
            console.log('Cập nhật tài khoản thành công!:', data);
        } else {
            console.log('Xóa tài khoản thành công!:', data);
        }
        return data;
    } catch (error) {
        throw error;
    }
};
