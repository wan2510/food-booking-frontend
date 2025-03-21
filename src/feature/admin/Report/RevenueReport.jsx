import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Space, DatePicker } from 'antd';
import moment from 'moment';
import RevenueChart from './components/RevenueChart';
import RevenueStatistics from './components/RevenueStatistics';
import RevenueFilter from './components/RevenueFilter';
import ExportButtons from './components/ExportButtons';
import { getRevenueData } from './RevenueService';
import './RevenueReport.css';

const { RangePicker } = DatePicker;

const RevenueReport = () => {
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month')
  ]);
  const [timeGroup, setTimeGroup] = useState('day');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      const data = await getRevenueData({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        timeGroup,
        status: filterStatus
      });
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, timeGroup, filterStatus]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleTimeGroupChange = (value) => {
    setTimeGroup(value);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
  };

  return (
    <div className="revenue-report">
      <Card title="Báo Cáo Doanh Thu" extra={<ExportButtons data={revenueData} />}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <RevenueFilter
            dateRange={dateRange}
            timeGroup={timeGroup}
            filterStatus={filterStatus}
            onDateRangeChange={handleDateRangeChange}
            onTimeGroupChange={handleTimeGroupChange}
            onStatusChange={handleStatusChange}
          />
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <RevenueStatistics data={revenueData} loading={loading} />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <RevenueChart data={revenueData} loading={loading} timeGroup={timeGroup} />
            </Col>
          </Row>
        </Space>
      </Card>
    </div>
  );
};

export default RevenueReport;
