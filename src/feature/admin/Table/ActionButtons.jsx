import React from "react";
import { Button, Input, Select, Space, Typography, Row, Col } from "antd";
import { PlusOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { TABLE_STATUS, TABLE_STATUS_LABELS } from "../../../constant/tableStatus";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const ActionButtons = ({ onAdd, onSearch, onStatusChange, onExport, loading }) => {
    const statusOptions = Object.entries(TABLE_STATUS_LABELS).map(([key, label]) => (
        <Option key={key} value={key}>{label}</Option>
    ));
    
    return (
        <div style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <Title level={4} style={{ margin: 0 }}>Quản lý bàn</Title>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={onAdd}
                        style={{ marginRight: 8 }}
                    >
                        Thêm bàn
                    </Button>
                    <Button 
                        icon={<FileExcelOutlined />} 
                        onClick={onExport}
                        disabled={loading}
                    >
                        Xuất Excel
                    </Button>
                </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={16} md={12} lg={8}>
                    <Search
                        placeholder="Tìm kiếm theo số bàn hoặc mô tả"
                        onSearch={onSearch}
                        enterButton={<SearchOutlined />}
                        allowClear
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={8} md={6} lg={4}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        onChange={onStatusChange}
                        style={{ width: '100%' }}
                        allowClear
                        disabled={loading}
                        suffixIcon={<FilterOutlined />}
                    >
                        {statusOptions}
                    </Select>
                </Col>
            </Row>
        </div>
    );
};

export default ActionButtons;