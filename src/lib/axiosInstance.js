import axios from 'axios';
import { BASE_URL } from '../constant/endpoint';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
