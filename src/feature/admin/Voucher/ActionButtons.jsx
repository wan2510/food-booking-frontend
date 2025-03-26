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
    setTypeFilter,
    setCreatedAtFilter,
    setExpiredAtFilter,
}) => {
    return (
        <div
            className="action-buttons"
            style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
        >
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm Voucher
            </Button>
            <div className="search-container">
                <Select
                    placeholder="Trạng thái"
                    style={{ width: '200px' }}
                    onChange={(value) => setStatusFilter(value)}
                    allowClear
                >
                    <Option value="">Tất cả trạng thái</Option>
                    <Option value="ACTIVE">Khả dụng</Option>
                    <Option value="INACTIVE">Không khả dụng</Option>
                </Select>

                <Select
                    placeholder="Loại voucher"
                    style={{ width: '200px' }}
                    onChange={(value) => setTypeFilter(value)}
                    allowClear
                >
                    <Option value="">Tất cả loại</Option>
                    <Option value="FOR_ALL_USERS">Cho người dùng</Option>
                    <Option value="FOR_NEW_USERS">Cho người mới</Option>
                    <Option value="FOR_VIP_USERS">Cho khách VIP</Option>
                    <Option value="FOR_STAFF">Cho nhân viên</Option>
                </Select>

                <DatePicker
                    placeholder="Ngày tạo"
                    format="DD/MM/YYYY"
                    onChange={(date) => setCreatedAtFilter(date)}
                    style={{ width: '150px' }}
                    allowClear
                />

                <DatePicker
                    placeholder="Ngày hết hạn"
                    format="DD/MM/YYYY"
                    onChange={(date) => setExpiredAtFilter(date)}
                    style={{ width: '150px' }}
                    allowClear
                />

                <Search
                    className="search-container"
                    placeholder="Nhập tên voucher"
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