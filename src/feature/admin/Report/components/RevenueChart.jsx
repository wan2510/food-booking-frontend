import React from 'react';
import { Card, Empty, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import moment from 'moment';

const RevenueChart = ({ data, loading, timeGroup }) => {
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || !data.revenueByTime || Object.keys(data.revenueByTime).length === 0) {
    return (
      <Card>
        <Empty description="Không có dữ liệu" />
      </Card>
    );
  }

  const chartData = Object.entries(data.revenueByTime).map(([timeKey, value]) => {
    let formattedTime = timeKey;
    if (timeGroup === 'day') {
      formattedTime = moment(timeKey).format('DD/MM/YYYY');
    } else if (timeGroup === 'month') {
      formattedTime = moment(timeKey).format('MM/YYYY');
    }

    return {
      time: formattedTime,
      revenue: value
    };
  }).sort((a, b) => moment(a.time, timeGroup === 'day' ? 'DD/MM/YYYY' : 'MM/YYYY') - moment(b.time, timeGroup === 'day' ? 'DD/MM/YYYY' : 'MM/YYYY'));

  const config = {
    data: chartData,
    xField: 'time',
    yField: 'revenue',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      time: {
        alias: 'Thời gian',
      },
      revenue: {
        alias: 'Doanh thu (VNĐ)',
        formatter: (value) => `${value.toLocaleString('vi-VN')}đ`,
      },
    },
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    color: '#1890ff',
    tooltip: {
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: datum.revenue.toLocaleString('vi-VN') + 'đ',
        };
      },
    },
  };

  return (
    <Card title="Biểu Đồ Doanh Thu">
      <Column {...config} height={400} />
    </Card>
  );
};

export default RevenueChart;
