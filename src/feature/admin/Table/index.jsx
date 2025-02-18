import React, { useState } from "react";
import './table.css';


const Table = () => {
    const [tableData, setTableData] = useState([
        { id: 1, number: 101, description: "Gần cửa sổ", status: 1, max_number_human: 4 },
        { id: 2, number: 102, description: "Gần bếp", status: 0, max_number_human: 2 }
    ]);

    const [editingRow, setEditingRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const addRow = () => {
        if (isEditing) return;
        const newRow = {
            id: tableData.length + 1,
            number: "",
            description: "",
            status: 1,
            max_number_human: ""
        };
        setTableData([...tableData, newRow]);
    };

    const openEditModal = (index) => {
        setEditingRow(index);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    const saveEdit = (updatedRow) => {
        const newData = [...tableData];
        newData[editingRow] = updatedRow;
        setTableData(newData);
        setIsModalOpen(false);
        setIsEditing(false);
    };

    const deleteRow = (index) => {
        if (isEditing) return;
        setTableData(tableData.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2>Quản lý Bàn Ăn</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Number</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Max Number Human</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.number}</td>
                            <td>{row.description}</td>
                            <td>{row.status ? "Active" : "Inactive"}</td>
                            <td>{row.max_number_human}</td>
                            <td>
                                <button onClick={() => openEditModal(index)} disabled={isEditing}>Sửa</button>
                                <button onClick={() => deleteRow(index)} disabled={isEditing}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button onClick={addRow} disabled={isEditing}>Thêm</button>

            {isModalOpen && (
                <EditModal
                    rowData={tableData[editingRow]}
                    onSave={saveEdit}
                    onClose={() => { setIsModalOpen(false); setIsEditing(false); }}
                />
            )}
        </div>
    );
};

const EditModal = ({ rowData, onSave, onClose }) => {
    const [formData, setFormData] = useState(rowData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "status" ? (value.toLowerCase() === "active" ? 1 : 0) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000
        }}>
            <h3>Chỉnh sửa</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Number:
                    <input type="text" name="number" value={formData.number} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </label>
                <label>
                    Status:
                    <select name="status" value={formData.status ? "Active" : "Inactive"} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>
                <label>
                    Max Number Human:
                    <input type="text" name="max_number_human" value={formData.max_number_human} onChange={handleChange} />
                </label>
                <button type="submit">Lưu</button>
                <button type="button" onClick={onClose}>Hủy</button>
            </form>
        </div>
    );
};

export default Table;
