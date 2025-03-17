import axiosInstance from '../../../lib/axiosInstance';
import moment from 'moment';

export const getRevenueData = async ({ startDate, endDate, timeGroup, status }) => {
  try {
    const response = await axiosInstance.get('/reports/revenue', {
      params: {
        startDate,
        endDate,
        timeGroup,
        status
      }
    });

    return processRevenueData(response.data, timeGroup);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

const processRevenueData = (data, timeGroup) => {
  const { orders, totalRevenue, orderStats } = data;

  // Tính toán doanh thu theo thời gian
  const revenueByTime = orders.reduce((acc, order) => {
    const timeKey = formatTimeKey(order.created_at, timeGroup);
    acc[timeKey] = (acc[timeKey] || 0) + order.total_price;
    return acc;
  }, {});

  // Tính toán top món ăn bán chạy
  const topSellingItems = calculateTopSellingItems(orders);

  // Tính toán doanh thu theo danh mục
  const revenueByCategory = calculateRevenueByCategory(orders);

  return {
    totalRevenue,
    orderStats,
    revenueByTime,
    topSellingItems,
    revenueByCategory,
    timeGroup
  };
};

const formatTimeKey = (dateString, timeGroup) => {
  const date = moment(dateString);
  switch (timeGroup) {
    case 'day':
      return date.format('YYYY-MM-DD');
    case 'month':
      return date.format('YYYY-MM');
    case 'year':
      return date.format('YYYY');
    default:
      return date.format('YYYY-MM-DD');
  }
};

const calculateTopSellingItems = (orders) => {
  const itemSales = {};
  
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!itemSales[item.food_id]) {
        itemSales[item.food_id] = {
          foodId: item.food_id,
          foodName: item.food_name,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      itemSales[item.food_id].totalQuantity += item.quantity;
      itemSales[item.food_id].totalRevenue += item.price * item.quantity;
    });
  });

  return Object.values(itemSales)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
};

const calculateRevenueByCategory = (orders) => {
  const categoryRevenue = {};

  orders.forEach(order => {
    order.items?.forEach(item => {
      const categoryId = item.category_id;
      if (!categoryRevenue[categoryId]) {
        categoryRevenue[categoryId] = {
          categoryId,
          categoryName: item.category_name,
          totalRevenue: 0,
          orderCount: 0
        };
      }
      categoryRevenue[categoryId].totalRevenue += item.price * item.quantity;
      categoryRevenue[categoryId].orderCount++;
    });
  });

  return Object.values(categoryRevenue)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const generatePdfReport = async (data) => {
  const { jsPDF } = require('jspdf');
  require('jspdf-autotable');
  const doc = new jsPDF();

  // Thông tin tiêu đề
  doc.setFontSize(20);
  doc.text('BÁO CÁO DOANH THU', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Thời gian: ${moment(data.startDate).format('DD/MM/YYYY')} - ${moment(data.endDate).format('DD/MM/YYYY')}`, 
    doc.internal.pageSize.width / 2, 30, { align: 'center' });

  // Thống kê tổng quan
  doc.setFontSize(14);
  doc.text('1. Thống kê tổng quan', 14, 45);
  const stats = [
    ['Tổng doanh thu', `${data.totalRevenue.toLocaleString('vi-VN')}đ`],
    ['Tổng số đơn hàng', data.orderStats?.COMPLETED || 0],
    ['Tỷ lệ hoàn thành', `${((data.orderStats?.COMPLETED || 0) / 
      (Object.values(data.orderStats || {}).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`],
  ];
  doc.autoTable({
    startY: 50,
    head: [['Chỉ số', 'Giá trị']],
    body: stats,
    theme: 'grid',
  });

  // Top 10 món ăn bán chạy
  doc.setFontSize(14);
  doc.text('2. Top 10 món ăn bán chạy', 14, doc.previousAutoTable.finalY + 15);
  const topItems = data.topSellingItems.map(item => [
    item.foodName,
    item.totalQuantity,
    `${item.totalRevenue.toLocaleString('vi-VN')}đ`
  ]);
  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Tên món', 'Số lượng', 'Doanh thu']],
    body: topItems,
    theme: 'grid',
  });

  // Doanh thu theo danh mục
  doc.setFontSize(14);
  doc.text('3. Doanh thu theo danh mục', 14, doc.previousAutoTable.finalY + 15);
  const categoryData = data.revenueByCategory.map(cat => [
    cat.categoryName,
    cat.orderCount,
    `${cat.totalRevenue.toLocaleString('vi-VN')}đ`
  ]);
  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Danh mục', 'Số đơn hàng', 'Doanh thu']],
    body: categoryData,
    theme: 'grid',
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Trang ${i} / ${pageCount}`, doc.internal.pageSize.width - 20, 
      doc.internal.pageSize.height - 10);
  }

  // Lưu file
  doc.save(`bao-cao-doanh-thu-${moment().format('DD-MM-YYYY')}.pdf`);
};

export const generateExcelReport = async (data) => {
  const XLSX = require('xlsx');

  // Tạo workbook mới
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tổng quan
  const overviewData = [
    ['BÁO CÁO DOANH THU'],
    [],
    ['1. Thống kê tổng quan'],
    ['Chỉ số', 'Giá trị'],
    ['Tổng doanh thu', `${data.totalRevenue.toLocaleString('vi-VN')}đ`],
    ['Tổng số đơn hàng', data.orderStats?.COMPLETED || 0],
    ['Đơn hàng hoàn thành', data.orderStats?.COMPLETED || 0],
    ['Đơn hàng đã hủy', data.orderStats?.CANCELLED || 0],
    ['Đơn hàng đang chờ', data.orderStats?.PENDING || 0],
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);

  // Sheet 2: Chi tiết doanh thu theo thời gian
  const timeData = [
    ['2. Doanh thu theo thời gian'],
    ['Thời gian', 'Doanh thu (VNĐ)'],
    ...Object.entries(data.revenueByTime).map(([time, revenue]) => [
      time,
      revenue
    ])
  ];
  const wsTime = XLSX.utils.aoa_to_sheet(timeData);

  // Sheet 3: Top món ăn bán chạy
  const topItemsData = [
    ['3. Top món ăn bán chạy'],
    ['Tên món', 'Số lượng đã bán', 'Doanh thu (VNĐ)'],
    ...data.topSellingItems.map(item => [
      item.foodName,
      item.totalQuantity,
      item.totalRevenue
    ])
  ];
  const wsTopItems = XLSX.utils.aoa_to_sheet(topItemsData);

  // Sheet 4: Doanh thu theo danh mục
  const categoryData = [
    ['4. Doanh thu theo danh mục'],
    ['Danh mục', 'Số đơn hàng', 'Doanh thu (VNĐ)'],
    ...data.revenueByCategory.map(cat => [
      cat.categoryName,
      cat.orderCount,
      cat.totalRevenue
    ])
  ];
  const wsCategory = XLSX.utils.aoa_to_sheet(categoryData);

  // Thêm các sheet vào workbook
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Tổng quan');
  XLSX.utils.book_append_sheet(wb, wsTime, 'Theo thời gian');
  XLSX.utils.book_append_sheet(wb, wsTopItems, 'Top món ăn');
  XLSX.utils.book_append_sheet(wb, wsCategory, 'Theo danh mục');

  // Lưu file
  XLSX.writeFile(wb, `bao-cao-doanh-thu-${moment().format('DD-MM-YYYY')}.xlsx`);
};
