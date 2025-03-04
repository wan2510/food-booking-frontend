import axios from 'axios';
import { BASE_URL } from '../constant/endpoint';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = 'Bearer ' + accessToken;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        console.log(response);
        return response;
    },
    (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.clear();
            window.location.href = '/login';
        }
    },
);

export default axiosInstance;
