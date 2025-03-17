import React from 'react';
import { Button, Space, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { generatePdfReport, generateExcelReport } from '../RevenueService';

const ExportButtons = ({ data }) => {
  const handleExportPDF = async () => {
    try {
      if (!data) {
        message.error('Không có dữ liệu để xuất báo cáo');
        return;
      }

      const testData = {
        ...data,
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
        totalRevenue: Number(data.totalRevenue) || 0,
        orderStats: {
          COMPLETED: Number(data.orderStats?.COMPLETED) || 0,
          CANCELLED: Number(data.orderStats?.CANCELLED) || 0,
          PENDING: Number(data.orderStats?.PENDING) || 0,
          ...data.orderStats
        },
        revenueByTime: Object.fromEntries(
          Object.entries(data.revenueByTime || {}).map(([key, value]) => [
            key,
            Number(value) || 0
          ])
        ),
        topSellingItems: (data.topSellingItems || []).map(item => ({
          ...item,
          totalQuantity: Number(item.totalQuantity) || 0,
          totalRevenue: Number(item.totalRevenue) || 0
        })),
        revenueByCategory: (data.revenueByCategory || []).map(cat => ({
          ...cat,
          orderCount: Number(cat.orderCount) || 0,
          totalRevenue: Number(cat.totalRevenue) || 0
        }))
      };

      message.loading('Đang xuất báo cáo PDF...');
      await generatePdfReport(testData);
      message.success('Xuất báo cáo PDF thành công');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      message.error('Lỗi khi xuất báo cáo PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      if (!data) {
        message.error('Không có dữ liệu để xuất báo cáo');
        return;
      }
      message.loading('Đang xuất báo cáo Excel...');
      await generateExcelReport(data);
      message.success('Xuất báo cáo Excel thành công');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      message.error('Lỗi khi xuất báo cáo Excel');
    }
  };

  return (
    <Space>
      <Button
        type="primary"
        icon={<FilePdfOutlined />}
        onClick={handleExportPDF}
        disabled={!data}
      >
        Xuất PDF
      </Button>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={handleExportExcel}
        disabled={!data}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Xuất Excel
      </Button>
    </Space>
  );
};

export default ExportButtons;
