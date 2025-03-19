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
        opacity: 0.85,
        fontSize: 12,
        fontWeight: 500,
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: '#666',
          fontSize: 12,
        },
      },
      line: {
        style: {
          stroke: '#f0f0f0',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#666',
          fontSize: 12,
        },
        formatter: (value) => `${(value / 1000000).toFixed(1)}M`,
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineDash: [4, 4],
          },
        },
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
      fill: 'l(270) 0:#1890ff 1:#36cfc9',
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 10,
    },
    animation: {
      appear: {
        animation: 'fade-in-y',
        duration: 1000,
        delay: 100,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: datum.revenue.toLocaleString('vi-VN') + 'đ',
        };
      },
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '12px',
          borderRadius: '8px',
        },
      },
    },
    interactions: [
      {
        type: 'active-region',
        enable: true,
      },
    ],
  };

  return (
    <Card title="Biểu Đồ Doanh Thu">
      <Column {...config} height={400} />
    </Card>
  );
};

export default RevenueChart;
