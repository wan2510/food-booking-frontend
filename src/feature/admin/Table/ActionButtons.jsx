import React from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const ActionButtons = ({ onAdd }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Search placeholder="Tìm kiếm bàn" onSearch={(value) => console.log("Tìm kiếm:", value)} style={{ width: 200 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>Thêm bàn</Button>
        </div>
    );
};

export default ActionButtons;