import axiosInstance from '../lib/axiosInstance';

export const LoginApi = async (loginRequest) => {
    return await axiosInstance.post('/auth/login', loginRequest);
};
