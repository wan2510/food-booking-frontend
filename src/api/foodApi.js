const BASE_URL = 'http://localhost:8080';

const foodHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export const getAllFoods = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/food`, {
            method: 'GET',
            headers: foodHeaders,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Không thể tải danh sách món ăn');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching foods:', error);
        throw error;
    }
};

export const getFoodByUuid = async (uuid) => {
    try {
        const response = await fetch(`${BASE_URL}/api/food/${uuid}`, {
            method: 'GET',
            headers: foodHeaders,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Không thể tải thông tin món ăn');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching food:', error);
        throw error;
    }
};

export const searchFoods = async (query, categoryUuid = 'all', priceFilter = 'all') => {
    try {
        const params = new URLSearchParams({
            query: query || '',
            categoryUuid,
            priceFilter
        });

        const response = await fetch(`${BASE_URL}/api/food/search?${params}`, {
            method: 'GET',
            headers: foodHeaders,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Không thể tìm kiếm món ăn');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching foods:', error);
        throw error;
    }
}; 