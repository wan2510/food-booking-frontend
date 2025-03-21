import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  TagsOutlined
} from '@ant-design/icons';

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
      <Row gutter={[16, 16]} className="fade-in">
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="statistic-card revenue-card">
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              suffix="đ"
              prefix={<DollarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
              formatter={(value) => `${value.toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="statistic-card orders-card">
            <Statistic
              title="Tổng số đơn hàng"
              value={totalOrders}
              prefix={<ShoppingOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="statistic-card completion-card">
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={completionRate}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ fontSize: '24px', color: '#3f8600' }} />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="statistic-card cancelled-card">
            <Statistic
              title="Đơn hàng bị hủy"
              value={cancelledOrders}
              prefix={<CloseCircleOutlined style={{ fontSize: '24px', color: '#cf1322' }} />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }} className="fade-in">
        <Col xs={24} md={12}>
          <Card 
            title={
              <span>
                <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                Top 10 Món Ăn Bán Chạy
              </span>
            }
            className="table-card"
          >
            <Table
              dataSource={topSellingItems}
              columns={topItemsColumns}
              rowKey="foodId"
              pagination={false}
              loading={loading}
              size="small"
              className="custom-table"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={
              <span>
                <TagsOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                Doanh Thu Theo Danh Mục
              </span>
            }
            className="table-card"
          >
            <Table
              dataSource={revenueByCategory}
              columns={categoryColumns}
              rowKey="categoryId"
              pagination={false}
              loading={loading}
              size="small"
              className="custom-table"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueStatistics;
