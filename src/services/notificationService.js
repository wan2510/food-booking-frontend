import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

export const getNotifications = async (userId) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}`); // Gọi đúng endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUnreadNotifications = async (userId) => {
    try {
        const response = await axiosInstance.get(`/${userId}/unread`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await axiosInstance.put(`/${id}/read`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNotification = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};