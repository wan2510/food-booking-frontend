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
        if (!Array.isArray(data)) {
            throw new Error('Dữ liệu không đúng định dạng!');
        }
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

        if (response.status !== 200 && response.status !== 201) {
            const errorData = await response.json();
            let errorMessage = errorData.message || 'Lỗi không xác định';
            if (response.status === 400) {
                if (errorMessage.includes('email')) {
                    errorMessage = 'Email đã tồn tại!';
                } else if (errorMessage.includes('phone')) {
                    errorMessage = 'Số điện thoại đã tồn tại!';
                } else if (errorMessage.includes('role')) {
                    errorMessage = 'Vai trò không hợp lệ!';
                }
            }
            throw new Error(`Không thể tạo tài khoản: ${errorMessage}`);
        }

        const data = await response.json();
        if (!data || typeof data !== 'object') {
            throw new Error('Dữ liệu trả về không hợp lệ!');
        }
        console.log('[API] Tài khoản mới tạo:', data);
        message.success('Tạo tài khoản thành công!');
        return data;
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);
        message.error(`Không thể tạo tài khoản: ${error.message}`);
        throw error;
    }
};

// Cập nhật tài khoản
export const updateAccount = async (userData) => {
    try {
        console.log('[API] Dữ liệu gửi để cập nhật tài khoản:', userData);
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể cập nhật tài khoản: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        if (!data || typeof data !== 'object') {
            throw new Error('Dữ liệu trả về không hợp lệ!');
        }
        console.log('[API] Tài khoản sau khi cập nhật:', data);
        if (userData.status === 'DELETED' && userData.status !== data.status) {
            message.success('Xóa tài khoản thành công!');
        } else {
            message.success('Cập nhật tài khoản thành công!');
        }
        return data;
    } catch (error) {
        console.error('Lỗi khi cập nhật tài khoản:', error);
        message.error('Cập nhật tài khoản thất bại!');
        throw error;
    }
};