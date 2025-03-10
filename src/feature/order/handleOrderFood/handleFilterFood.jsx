import React, { useState } from "react";
import { Button, Input, Dropdown, Menu } from "antd";
import { PlusOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Search } = Input;

const ActionButtons = ({ onAdd, onSearch, onFilter }) => {
    const [searchText, setSearchText] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); 

    const handleSearch = (value) => {
        setSearchText(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleFilter = ({ key }) => {
        let newSortOrder = sortOrder === "asc" ? "desc" : "asc"; 
        setSortField(key);
        setSortOrder(newSortOrder);

        if (onFilter) {
            onFilter(key, newSortOrder);
        }
    };

    const items = [
        { key: "discount", label: "Giảm giá" },
        { key: "max_discount_value", label: "Giảm tối đa" },
        { key: "min_order_value", label: "Mức tối thiểu" },
        { key: "create_at", label: "Ngày tạo" },
        { key: "expired_at", label: "Ngày hết hạn" },
        { key: "quantity", label: "Số lượng" },
        { key: "remain_quantity", label: "Còn lại" },
        { key: "status", label: "Trạng thái" },
    ];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm Voucher
            </Button>

            <div style={{ display: "flex", marginLeft: "auto", gap: "8px" }}>
                <Search
                    placeholder="Nhập từ khóa tìm kiếm"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    enterButton
                    style={{ width: "250px" }}
                />

                <Dropdown menu={{ items, onClick: handleFilter }} placement="bottomLeft">
                    <Button>
                        Lọc{" "}
                        <FilterOutlined style={{ fontSize: "16px", color: "#08c" }} />
                        {sortField && ( 
                            sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                        )}
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default ActionButtons;
