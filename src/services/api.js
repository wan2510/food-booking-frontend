const API_BASE_URL = 'http://localhost:8080';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const authHeaders = (token) => ({
    ...defaultHeaders,
    'Authorization': `Bearer ${token}`
});

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
        if (response.status === 401) {
            // Clear all auth data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userUuid');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }
        
        const errorData = isJson ? await response.json() : await response.text();
        throw new Error(errorData.error || errorData || 'API request failed');
    }

    return isJson ? response.json() : response.text();
};

const defaultConfig = {
    mode: 'cors',
    credentials: 'include',
    headers: defaultHeaders
};

const authConfig = (token) => ({
    ...defaultConfig,
    headers: authHeaders(token)
});

export const api = {
    // Food APIs
    getFoods: () => 
        fetch(`${API_BASE_URL}/api/food`, {
            ...defaultConfig,
            method: 'GET'
        }).then(handleResponse),

    // Category APIs
    getCategories: () =>
        fetch(`${API_BASE_URL}/api/category`, {
            ...defaultConfig,
            method: 'GET'
        }).then(handleResponse),

    // Cart APIs
    getCart: (userUuid, token) =>
        fetch(`${API_BASE_URL}/api/cart/${userUuid}`, {
            ...authConfig(token),
            method: 'GET'
        }).then(handleResponse),

    addToCart: (userUuid, foodUuid, quantity, token) =>
        fetch(`${API_BASE_URL}/api/cart/add`, {
            ...authConfig(token),
            method: 'POST',
            body: JSON.stringify({
                userUuid,
                foodUuid,
                quantity
            })
        }).then(handleResponse),

    updateCartItem: (cartItemId, quantity, token) =>
        fetch(`${API_BASE_URL}/api/cart/update`, {
            ...authConfig(token),
            method: 'PUT',
            body: JSON.stringify({
                cartItemId,
                quantity
            })
        }).then(handleResponse),

    removeCartItem: (cartItemId, token) =>
        fetch(`${API_BASE_URL}/api/cart/remove/${cartItemId}`, {
            ...authConfig(token),
            method: 'DELETE'
        }).then(handleResponse),

    clearCart: (userUuid, token) =>
        fetch(`${API_BASE_URL}/api/cart/clear/${userUuid}`, {
            ...authConfig(token),
            method: 'DELETE'
        }).then(handleResponse),

    // Review APIs
    getReviews: () =>
        fetch(`${API_BASE_URL}/api/reviews`, {
            ...defaultConfig,
            method: 'GET'
        }).then(handleResponse),

    addReview: (reviewData, token) =>
        fetch(`${API_BASE_URL}/api/reviews`, {
            ...authConfig(token),
            method: 'POST',
            body: JSON.stringify(reviewData)
        }).then(handleResponse),

    // Auth APIs
    login: (email, password) =>
        fetch(`${API_BASE_URL}/api/auth/login`, {
            ...defaultConfig,
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(handleResponse)
};
