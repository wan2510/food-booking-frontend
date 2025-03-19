// Mock data for tables
const mockTables = [
    {
        id: 1,
        tableNumber: "A01",
        description: "Bàn góc cạnh cửa sổ",
        capacity: 4,
        status: "EMPTY"
    },
    {
        id: 2,
        tableNumber: "A02",
        description: "Bàn trung tâm",
        capacity: 6,
        status: "RESERVED"
    },
    {
        id: 3,
        tableNumber: "A03",
        description: "Bàn khu vực ngoài trời",
        capacity: 8,
        status: "OCCUPIED"
    },
    {
        id: 4,
        tableNumber: "B01",
        description: "Bàn phòng VIP",
        capacity: 10,
        status: "EMPTY"
    },
    {
        id: 5,
        tableNumber: "B02",
        description: "Bàn phòng VIP 2",
        capacity: 8, 
        status: "EMPTY"
    }
];

// Helper function to filter tables based on search parameters
const filterTables = (tables, params) => {
    let filteredTables = [...tables];
    
    if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredTables = filteredTables.filter(table => 
            table.tableNumber.toLowerCase().includes(searchTerm) || 
            table.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (params.status) {
        filteredTables = filteredTables.filter(table => 
            table.status === params.status
        );
    }
    
    return filteredTables;
};

// Helper function to paginate results
const paginateResults = (data, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
        tables: paginatedData,
        pagination: {
            total: data.length,
            page: parseInt(page),
            limit: parseInt(limit)
        }
    };
};

export const mockTableApi = {
    // Get all tables with optional filtering and pagination
    getTables: (params = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filteredTables = filterTables(mockTables, params);
                const result = paginateResults(
                    filteredTables, 
                    params.page || 1, 
                    params.limit || 10
                );
                
                resolve({
                    success: true,
                    data: result
                });
            }, 500); // Simulate network delay
        });
    },
    
    // Get a single table by ID
    getTableById: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const table = mockTables.find(t => t.id === parseInt(id));
                
                if (table) {
                    resolve({
                        success: true,
                        data: table
                    });
                } else {
                    reject({
                        success: false,
                        message: "Không tìm thấy bàn"
                    });
                }
            }, 300);
        });
    },
    
    // Create a new table
    createTable: (tableData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if table number already exists
                const tableExists = mockTables.some(
                    t => t.tableNumber === tableData.tableNumber
                );
                
                if (tableExists) {
                    reject({
                        success: false,
                        message: "Số bàn đã tồn tại"
                    });
                    return;
                }
                
                const newTable = {
                    id: mockTables.length + 1,
                    ...tableData
                };
                
                mockTables.push(newTable);
                
                resolve({
                    success: true,
                    data: newTable
                });
            }, 500);
        });
    },
    
    // Update an existing table
    updateTable: (id, tableData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTables.findIndex(t => t.id === parseInt(id));
                
                if (index === -1) {
                    reject({
                        success: false,
                        message: "Không tìm thấy bàn"
                    });
                    return;
                }
                
                // Check if updated table number already exists (except for this table)
                const tableNumberExists = mockTables.some(
                    t => t.tableNumber === tableData.tableNumber && t.id !== parseInt(id)
                );
                
                if (tableNumberExists) {
                    reject({
                        success: false,
                        message: "Số bàn đã tồn tại"
                    });
                    return;
                }
                
                const updatedTable = {
                    ...mockTables[index],
                    ...tableData
                };
                
                mockTables[index] = updatedTable;
                
                resolve({
                    success: true,
                    data: updatedTable
                });
            }, 500);
        });
    },
    
    // Delete a table
    deleteTable: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTables.findIndex(t => t.id === parseInt(id));
                
                if (index === -1) {
                    reject({
                        success: false,
                        message: "Không tìm thấy bàn"
                    });
                    return;
                }
                
                mockTables.splice(index, 1);
                
                resolve({
                    success: true,
                    message: "Xóa bàn thành công"
                });
            }, 500);
        });
    }
}; 