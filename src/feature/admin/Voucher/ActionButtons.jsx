import React from "react";
import { Button, Input, Dropdown } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";

const { Search } = Input;

const ActionButtons = ({ onAdd }) => {
    const onSearch = (value) => {
        console.log("Tìm kiếm:", value);
    };

    const handleMenuClick = (e) => {
        console.log("Menu item clicked:", e);
    };

    const items = [
        {
            key: "1",
            label: <a href="http://localhost:5173/admin/Voucher">Giảm giá</a>,
        },
        {
            key: "2",
            label: <a href="http://localhost:5173/admin/Voucher">Giảm tối đa</a>,
        },
        {
            key: "3",
            label: <a href="http://localhost:5173/admin/Voucher">Mức tối thiểu</a>,
        },
        {
            key: "4",
            label: <a href="http://localhost:5173/admin/Voucher">Ngày tạo</a>,
        },
        {
            key: "5",
            label: <a href="http://localhost:5173/admin/Voucher">Ngày hết hạn</a>,
        },
        {
            key: "6",
            label: <a href="http://localhost:5173/admin/Voucher">Số lượng</a>,
        },
        {
            key: "7",
            label: <a href="http://localhost:5173/admin/Voucher">Còn lại</a>,
        },
        {
            key: "8",
            label: <a href="http://localhost:5173/admin/Voucher">Trạng thái</a>,
        },
    ];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm Voucher
            </Button>

            <div style={{ display: "flex", marginLeft: "auto", gap: "8px" }}>
                <Search
                    placeholder="Nhập từ khóa tìm kiếm"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: "250px" }}
                />

                <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomLeft">
                    <Button>
                        Lọc <FilterOutlined style={{ fontSize: "16px", color: "#08c" }} />
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default ActionButtons;
