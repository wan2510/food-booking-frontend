import React, { useState } from "react";
import { Form } from "antd";
import TableModal from "./TableModal/TableModal";
import RestaurantTable from "./RestaurantTable";
import ActionButtons from "./ActionButtons";

const Table = () => {
    const [tables, setTables] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingTable, setEditingTable] = useState(null);

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

    const handleDelete = (id) => {
        setTables(tables.filter(table => table.id !== id));
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingTable) {
                setTables(tables.map(table => (table.id === editingTable.id ? { ...table, ...values } : table)));
            } else {
                setTables([...tables, { id: tables.length + 1, ...values }]);
            }
            setModalVisible(false);
        });
    };

    return (
        <div>
            <ActionButtons onAdd={handleAdd} />
            <RestaurantTable tables={tables} onEdit={handleEdit} onDelete={handleDelete} />
            <TableModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSave} form={form} editingTable={editingTable} />
        </div>
    );
};

export default Table;
