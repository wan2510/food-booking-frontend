import React, { useState, useEffect, useCallback } from "react";
import { Form, message, Card } from "antd";
import TableModal from "./TableModal/TableModal";
import RestaurantTable from "./RestaurantTable";
import ActionButtons from "./ActionButtons";
import { tableApi } from "../../../api/TableApi";
import { TABLE_STATUS } from "../../../constant/tableStatus";
import { ExportOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import './table.css';
import { mockTableApi } from "../../../services/mockApi";

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchParams, setSearchParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        status: ''
    });
    
    const [form] = Form.useForm();
    const [editingTable, setEditingTable] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchTables = useCallback(async () => {
        try {
            setLoading(true);
            const response = await tableApi.getTables(searchParams);
            
            if (response.success) {
                setTables(response.data.tables);
                setPagination({
                    current: response.data.pagination.page,
                    pageSize: response.data.pagination.limit,
                    total: response.data.pagination.total
                });
            }
        } catch (error) {
            messageApi.error('Không thể tải danh sách bàn: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [searchParams, messageApi]);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    const handleAdd = () => {
        setEditingTable(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        form.setFieldsValue(table);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await tableApi.deleteTable(id);
            
            if (response.success) {
                messageApi.success('Xóa bàn thành công');
                fetchTables();
            }
        } catch (error) {
            messageApi.error('Không thể xóa bàn: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            const response = editingTable 
                ? await tableApi.updateTable(editingTable.id, values)
                : await tableApi.createTable(values);
            
            if (response.success) {
                messageApi.success(editingTable ? 'Cập nhật bàn thành công' : 'Thêm bàn thành công');
                setModalVisible(false);
                fetchTables();
            } else {
                // Xử lý lỗi trùng số bàn
                if (response.message && response.message.includes("Số bàn đã tồn tại")) {
                    form.setFields([
                        {
                            name: 'tableNumber',
                            errors: ['Số bàn này đã tồn tại, vui lòng chọn số bàn khác']
                        }
                    ]);
                } else if (response.errors) {
                    // Xử lý các lỗi validation khác
                    Object.entries(response.errors).forEach(([field, error]) => {
                        form.setFields([{
                            name: field,
                            errors: [error]
                        }]);
                    });
                } else {
                    messageApi.error(response.message || 'Có lỗi xảy ra');
                }
            }
        } catch (error) {
            // Form validation error from antd
            console.log('Validation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchParams(prev => ({
            ...prev,
            search: value,
            page: 1 // Reset to first page on new search
        }));
    };

    const handleStatusChange = (value) => {
        setSearchParams(prev => ({
            ...prev,
            status: value || '',
            page: 1 // Reset to first page on filter change
        }));
    };

    const handleTableChange = (pagination) => {
        setSearchParams(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize
        }));
    };

    const handleExportToExcel = () => {
        // Prepare data for Excel export
        const exportData = tables.map(table => ({
            'Số bàn': table.tableNumber,
            'Mô tả': table.description,
            'Sức chứa': table.capacity,
            'Trạng thái': table.status === TABLE_STATUS.EMPTY 
                ? 'Trống' 
                : table.status === TABLE_STATUS.RESERVED 
                    ? 'Đã đặt' 
                    : 'Đang phục vụ'
        }));
        
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách bàn');
        
        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `danh_sach_ban_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        messageApi.success('Xuất file Excel thành công');
    };

    return (
        <Card className="table-management-container">
            {contextHolder}
            <ActionButtons 
                onAdd={handleAdd} 
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
                onExport={handleExportToExcel}
                loading={loading}
            />
            <RestaurantTable 
                tables={tables} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => {
                        handleTableChange({ current: page, pageSize });
                    }
                }}
                loading={loading}
            />
            <TableModal 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                onSave={handleSave} 
                form={form} 
                editingTable={editingTable}
                loading={loading}
            />
        </Card>
    );
};

export default TableManagement;
