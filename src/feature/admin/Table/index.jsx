import React, { useState } from "react";

const Table = () => {
    const [tableData, setTableData] = useState([
        { id: 1, number: 101, description: "Gần cửa sổ", status: 1, max_number_human: 4 },
        { id: 2, number: 102, description: "Gần bếp", status: 0, max_number_human: 2 }
    ]);

    const addRow = () => {
        const newRow = {
            id: tableData.length + 1,
            number: "",
            description: "",
            status: 1,
            max_number_human: ""
        };
        setTableData([...tableData, newRow]);
    };

    const editRow = (index, key, value) => {
        const newData = [...tableData];
        newData[index][key] = key === "status" ? (value.toLowerCase() === "active" ? 1 : 0) : value;
        setTableData(newData);
    };

    const deleteRow = (index) => {
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
                            <td contentEditable onBlur={(e) => editRow(index, "number", e.target.innerText)}>{row.number}</td>
                            <td contentEditable onBlur={(e) => editRow(index, "description", e.target.innerText)}>{row.description}</td>
                            <td contentEditable onBlur={(e) => editRow(index, "status", e.target.innerText)}>{row.status ? "Active" : "Inactive"}</td>
                            <td contentEditable onBlur={(e) => editRow(index, "max_number_human", e.target.innerText)}>{row.max_number_human}</td>
                            <td>
                                <button onClick={() => deleteRow(index)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button onClick={addRow}>Thêm</button>
        </div>
    );
};

export default Table;
