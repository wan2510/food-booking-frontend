import React from 'react';
import { Card, DatePicker, Select, Space, Row, Col } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const RevenueFilter = ({
  dateRange,
  timeGroup,
  filterStatus,
  onDateRangeChange,
  onTimeGroupChange,
  onStatusChange
}) => {
  const timeGroupOptions = [
    { value: 'day', label: 'Theo ngày' },
    { value: 'month', label: 'Theo tháng' },
    { value: 'year', label: 'Theo năm' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả đơn hàng' },
    { value: 'COMPLETED', label: 'Đơn đã hoàn thành' },
    { value: 'CANCELLED', label: 'Đơn đã hủy' },
    { value: 'PENDING', label: 'Đơn đang chờ' }
  ];

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={8}>
          <div>
            <label className="filter-label">Khoảng thời gian:</label>
            <RangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              disabledDate={disabledDate}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div>
            <label className="filter-label">Nhóm theo:</label>
            <Select
              value={timeGroup}
              onChange={onTimeGroupChange}
              options={timeGroupOptions}
              style={{ width: '100%' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div>
            <label className="filter-label">Trạng thái đơn hàng:</label>
            <Select
              value={filterStatus}
              onChange={onStatusChange}
              options={statusOptions}
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default RevenueFilter;
