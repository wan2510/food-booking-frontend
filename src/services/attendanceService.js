import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendance';

export const getAttendanceByStaff = async (staffUuid) => {
    const response = await axios.get(`${API_URL}/staff/${staffUuid}`);
    return response.data;
};