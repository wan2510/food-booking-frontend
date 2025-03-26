import axios from 'axios';

const API_URL = 'http://localhost:8080/api/shifts';

export const getAllShifts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getShiftsByStatus = async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`);
    return response.data;
};

export const getShiftsByDate = async (date) => {
    const response = await axios.get(`${API_URL}/date/${date}`);
    return response.data;
};

export const getShiftsByStaff = async (staffUuid) => {
    const response = await axios.get(`${API_URL}/staff/${staffUuid}`);
    return response.data;
};

export const createShift = async (shift) => {
    const response = await axios.post(API_URL, shift);
    return response.data;
};

export const updateShift = async (id, shift) => {
    const response = await axios.put(`${API_URL}/${id}`, shift);
    return response.data;
};

export const deleteShift = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};