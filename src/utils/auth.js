export const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    const userUuid = localStorage.getItem('userUuid');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    return {
        isAuthenticated: !!(accessToken && userUuid),
        userData: {
            uuid: userUuid,
            email: userEmail,
            name: userName
        }
    };
};

export const requireAuth = (navigate) => {
    const { isAuthenticated } = checkAuth();
    if (!isAuthenticated) {
        navigate('/login');
        return false;
    }
    return true;
};
