import React from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const ActionButtons = ({
    onAdd,
    searchText,
    setSearchText,
    setStatusFilter,
    setCreatedAtFilter,
    setRoleFilter,
}) => {
    return (
        <div
            className="action-buttons"
            style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
        >
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm Tài Khoản
            </Button>
            <div className="search-container">
                <DatePicker
                    placeholder="Ngày tạo"
                    format="DD/MM/YYYY"
                    onChange={(date) =>
                        setCreatedAtFilter(date ? date.toISOString() : null)
                    }
                    allowClear
                />

                <Select
                    placeholder="Trạng thái"
                    onChange={(value) => setStatusFilter(value || null)}
                    allowClear
                >
                    <Option value="ACTIVE">Kích hoạt</Option>
                    <Option value="INACTIVE">Vô hiệu hóa</Option>
                </Select>
                <Select
                    placeholder="Vai trò"
                    style={{ width: '200px' }}
                    onChange={(value) => setRoleFilter(value)}
                    allowClear
                >
                    <Option value="">Tất cả vai trò</Option>
                    <Option value="ROLE_NEW_USER">Người dùng mới</Option>
                    <Option value="ROLE_USER">Người dùng</Option>
                    <Option value="ROLE_STAFF">Nhân viên</Option>
                    <Option value="ROLE_ADMIN">Quản trị viên</Option>
                </Select>
                <Search
                    placeholder="Nhập tên tài khoản"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={setSearchText}
                    style={{ width: '250px' }}
                    allowClear
                />
            </div>
        </div>
    );
};

export default ActionButtons;
