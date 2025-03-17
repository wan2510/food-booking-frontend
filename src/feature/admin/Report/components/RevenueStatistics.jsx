import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const RevenueStatistics = ({ data, loading }) => {
  if (!data) return null;

  const { totalRevenue, orderStats, topSellingItems, revenueByCategory } = data;

  // Cấu hình cho bảng top món ăn bán chạy
  const topItemsColumns = [
    {
      title: 'Tên món',
      dataIndex: 'foodName',
      key: 'foodName',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      align: 'right',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      align: 'right',
      render: (value) => `${value.toLocaleString('vi-VN')}đ`,
    },
  ];

  // Cấu hình cho bảng doanh thu theo danh mục
  const categoryColumns = [
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
      align: 'right',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      align: 'right',
      render: (value) => `${value.toLocaleString('vi-VN')}đ`,
    },
  ];

  const completedOrders = orderStats?.COMPLETED || 0;
  const cancelledOrders = orderStats?.CANCELLED || 0;
  const pendingOrders = orderStats?.PENDING || 0;
  const totalOrders = completedOrders + cancelledOrders + pendingOrders;
  const completionRate = totalOrders ? (completedOrders / totalOrders * 100).toFixed(1) : 0;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              suffix="đ"
              formatter={(value) => `${value.toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={totalOrders}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={completionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng bị hủy"
              value={cancelledOrders}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={12}>
          <Card title="Top 10 Món Ăn Bán Chạy">
            <Table
              dataSource={topSellingItems}
              columns={topItemsColumns}
              rowKey="foodId"
              pagination={false}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Doanh Thu Theo Danh Mục">
            <Table
              dataSource={revenueByCategory}
              columns={categoryColumns}
              rowKey="categoryId"
              pagination={false}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueStatistics;
