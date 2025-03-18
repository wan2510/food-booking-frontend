import React from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const ActionButtons = ({ onAdd, searchText, setSearchText }) => {
  return (
    <div className="action-buttons">
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Thêm Voucher
      </Button>
      <div className="search-container">
        <Search
          placeholder="Nhập tên voucher"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={setSearchText}
          style={{ width: "250px" }}
          allowClear
        />
      </div>
    </div>
  );
};

export default ActionButtons;