import { API_CONFIG } from '../config/apiConfig';
import { mockTableApi } from '../services/mockApi';
import axiosInstance from '../lib/axiosInstance';

class TableApi {
    constructor() {
        this.useMockApi = API_CONFIG.USE_MOCK_API;
    }

    async getTables(params) {
        if (this.useMockApi) {
            return mockTableApi.getTables(params);
        }

        try {
            const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.TABLES, { params });
            return {
                success: true,
                data: {
                    tables: response.data.data.content,
                    pagination: {
                        total: response.data.data.pagination.total,
                        page: params.page || 1,
                        limit: params.limit || 10
                    }
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi khi lấy danh sách bàn'
            };
        }
    }

    async getTableById(id) {
        if (this.useMockApi) {
            return mockTableApi.getTableById(id);
        }

        try {
            const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.TABLES}/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Không tìm thấy bàn'
            };
        }
    }

    async createTable(tableData) {
        if (this.useMockApi) {
            return mockTableApi.createTable(tableData);
        }

        try {
            const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.TABLES, tableData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi khi tạo bàn mới'
            };
        }
    }

    async updateTable(id, tableData) {
        if (this.useMockApi) {
            return mockTableApi.updateTable(id, tableData);
        }

        try {
            const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.TABLES}/${id}`, tableData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi khi cập nhật bàn'
            };
        }
    }

    async deleteTable(id) {
        if (this.useMockApi) {
            return mockTableApi.deleteTable(id);
        }

        try {
            await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.TABLES}/${id}`);
            return {
                success: true,
                message: 'Xóa bàn thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi khi xóa bàn'
            };
        }
    }
}

export const tableApi = new TableApi();
