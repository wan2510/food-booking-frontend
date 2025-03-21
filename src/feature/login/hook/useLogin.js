import { useMutation } from '@tanstack/react-query';
import { LoginApi } from '../../../api/AuthApi';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export const useLogin = () => {
    const navigate = useNavigate();

    const handleLoggedIn = (data) => {
        const accessToken = data.data.accessToken;
        const userInfo = data.data.user;

        if (!accessToken || !userInfo) {
            message.error('Đã xảy ra lỗi, vui lòng thử lại sau');
            return;
        }

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(userInfo));

        navigateToPage(userInfo.role);
    };

    const navigateToPage = (role) => {
        switch (role) {
            case 'ROLE_USER':
                navigate('/');
                break;
            case 'ROLE_ADMIN':
                navigate('/admin');
                break;
            default:
                navigate('/login');
                break;
        }
    };

    const { mutate: loginMutate } = useMutation({
        mutationFn: LoginApi,
        onSuccess: handleLoggedIn,
        onError: (error) => {
            message.error(error.response.data.errorMessage);
        },
    });

    return { loginMutate };
};
