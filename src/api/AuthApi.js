import axiosInstance from '../lib/axiosInstance';

export const LoginApi = async (loginRequest) => {
    try {
        const response = await axiosInstance.post('/auth/login', loginRequest);
        if (response.data) {
            const { user, accessToken } = response.data;
            localStorage.setItem("userUuid", user.uuid);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify({
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            }));
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const LogoutApi = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        localStorage.clear();
        return response;
    } catch (error) {
        throw error;
    }
};
