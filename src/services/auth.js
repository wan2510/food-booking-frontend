export const auth = {
    clearAuthData: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userUuid');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    },

    getAuthData: () => {
        const token = localStorage.getItem('accessToken');
        const userUuid = localStorage.getItem('userUuid');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');

        return {
            token,
            userUuid,
            userEmail,
            userName,
            userRole,
            isAuthenticated: !!(token && userUuid)
        };
    },

    setAuthData: (data) => {
        if (data.token) localStorage.setItem('accessToken', data.token);
        if (data.userUuid) localStorage.setItem('userUuid', data.userUuid);
        if (data.userEmail) localStorage.setItem('userEmail', data.userEmail);
        if (data.userName) localStorage.setItem('userName', data.userName);
        if (data.userRole) localStorage.setItem('userRole', data.userRole);
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        const userUuid = localStorage.getItem('userUuid');
        return !!(token && userUuid);
    }
};
