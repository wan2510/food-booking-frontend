import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ActionButtons = ({ onAdd }) => {
    return (
        <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ marginBottom: 16 }}
        >
            Thêm Voucher
        </Button>
    );
};

export default ActionButtons;
