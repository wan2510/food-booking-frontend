import { message } from 'antd';

const API_URL = 'http://localhost:8080/api/user';

export const getAccounts = async () => {
    try {
        const response = await fetch(`${API_URL}/getListAccount`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data!');
        }
        const data = await response.json();
        return data.filter(account => !account.deletedAt); // Chỉ lấy các tài khoản chưa bị xóa mềm
    } catch (error) {
        console.error('Error fetching accounts:', error);
        message.error(`Unable to fetch data: ${error.message}`);
        throw error;
    }
};

export const createNewStaffAccount = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/createNewStaffAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Unable to create account for user: ${response.status} - ${errorText}`,
            );
        }
        const data = await response.json();
        console.log('New account created:', data);
        message.success('Account created successfully!');
        return data;
    } catch (error) {
        console.error('Error creating account:', error);
        message.error(`Unable to create account: ${error.message}`);
        throw error;
    }
};

export const updateAccount = async (id, userData) => {
    try {
        const response = await fetch(`${API_URL}/updateAccount/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Unable to update account: ${response.status} - ${errorText}`,
            );
        }
        const data = await response.json();
        console.log('Account updated:', data);
        message.success('Account updated successfully!');
        return data;
    } catch (error) {
        console.error('Error updating account:', error);
        message.error('Failed to update account!');
        throw error;
    }
};

export const softDeleteAccount = async (id) => {
    try {
        const response = await fetch(`${API_URL}/updateAccount/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            body: JSON.stringify({ deletedAt: new Date().toISOString() }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Unable to soft delete account: ${response.status} - ${errorText}`,
            );
        }
        const data = await response.json();
        console.log('Account soft deleted:', data);
        message.success('Account soft deleted successfully!');
        return data;
    } catch (error) {
        console.error('Error soft deleting account:', error);
        message.error('Failed to soft delete account!');
        throw error;
    }
};