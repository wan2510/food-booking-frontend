import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getAllStaff = async () => {
    const response = await axios.get(`${API_URL}/staff`);
    return response.data;
};

export const getStaffByStatus = async (status) => {
    const response = await axios.get(`${API_URL}/staff/status/${status}`);
    return response.data;
};

export const searchStaff = async (keyword) => {
    const response = await axios.get(`${API_URL}/staff/search?keyword=${keyword}`);
    return response.data;
};

export const createStaff = async (staff) => {
    const response = await axios.post(`${API_URL}/staff`, staff);
    return response.data;
};

export const updateStaff = async (uuid, staff) => {
    const response = await axios.put(`${API_URL}/staff/${uuid}`, staff);
    return response.data;
};

export const deleteStaff = async (uuid) => {
    await axios.delete(`${API_URL}/staff/${uuid}`);
};