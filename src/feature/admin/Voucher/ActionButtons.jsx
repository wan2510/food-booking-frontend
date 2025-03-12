import React, { useState } from "react";
import { Button, Input, Dropdown } from "antd";
import { PlusOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Search } = Input;

const ActionButtons = ({ onAdd, searchText, setSearchText, onSort }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = ({ key }) => {
        setSortField(key);
        onSort(key, sortOrder);
    };

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        if (sortField) {
            onSort(sortField, newSortOrder);
        }
    };

    const items = [
        { key: "code", label: "Mã Voucher" },
        { key: "name", label: "Tên Voucher" },
        { key: "discount", label: "Giảm giá (%)" },
        { key: "max_discount_value", label: "Giảm tối đa (kVNĐ)" },
        { key: "min_order_value", label: "Mức tối thiểu (kVNĐ)" },
        { key: "create_at", label: "Ngày tạo" },
        { key: "expired_at", label: "Ngày hết hạn" },
        { key: "type", label: "Loại" },
        { key: "status", label: "Trạng thái" },
    ];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm Voucher
            </Button>

            <div style={{ display: "flex", marginLeft: "auto", gap: "8px" }}>
                <Search
                    placeholder="Nhập tên voucher"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
        </div>
    );
};

export default ActionButtons;
