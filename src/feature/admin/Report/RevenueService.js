import axiosInstance from '../../../lib/axiosInstance';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  const { orders = [], totalRevenue = 0, orderStats = {} } = data;

  // Tính toán doanh thu theo thời gian
  const revenueByTime = orders.reduce((acc, order) => {
    if (!order.created_at || !order.total_price) return acc;
    
    const timeKey = formatTimeKey(order.created_at, timeGroup);
    const price = Number(order.total_price) || 0;
    acc[timeKey] = (Number(acc[timeKey]) || 0) + price;
    return acc;
  }, {});

  // Tính toán top món ăn bán chạy
  const topSellingItems = calculateTopSellingItems(orders);

  // Tính toán doanh thu theo danh mục
  const revenueByCategory = calculateRevenueByCategory(orders);

  return {
    totalRevenue: Number(totalRevenue) || 0,
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
      if (!item.food_id) return;

      if (!itemSales[item.food_id]) {
        itemSales[item.food_id] = {
          foodId: item.food_id,
          foodName: item.food_name || 'Unknown',
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      itemSales[item.food_id].totalQuantity += quantity;
      itemSales[item.food_id].totalRevenue += price * quantity;
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
      if (!item.category_id) return;

      if (!categoryRevenue[item.category_id]) {
        categoryRevenue[item.category_id] = {
          categoryId: item.category_id,
          categoryName: item.category_name || 'Unknown',
          totalRevenue: 0,
          orderCount: 0
        };
      }
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      categoryRevenue[item.category_id].totalRevenue += price * quantity;
      categoryRevenue[item.category_id].orderCount++;
    });
  });

  return Object.values(categoryRevenue)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const generatePdfReport = async (data) => {
  try {
    console.log('Generating PDF with data:', data);
    
    // Tạo một container tạm thời để render báo cáo
    const reportContainer = document.createElement('div');
    reportContainer.className = 'pdf-report-container';
    reportContainer.style.width = '595px'; // A4 width in pixels at 72 DPI
    reportContainer.style.padding = '40px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Tạo header với logo (nếu có)
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '30px';
    
    // Nếu có logo, thêm vào đây
    // const logo = document.createElement('img');
    // logo.src = '/path-to-your-logo.png';
    // logo.style.height = '60px';
    // logo.style.marginBottom = '15px';
    // header.appendChild(logo);
    
    // Tiêu đề báo cáo
    const title = document.createElement('h1');
    title.textContent = 'BÁO CÁO DOANH THU';
    title.style.fontSize = '24px';
    title.style.color = '#2c3e50';
    title.style.margin = '0 0 10px 0';
    header.appendChild(title);
    
    // Thời gian báo cáo
    const dateRange = document.createElement('p');
    dateRange.textContent = `Thời gian: ${moment(data.startDate).format('DD/MM/YYYY')} - ${moment(data.endDate).format('DD/MM/YYYY')}`;
    dateRange.style.fontSize = '14px';
    dateRange.style.color = '#7f8c8d';
    dateRange.style.margin = '0';
    header.appendChild(dateRange);
    
    reportContainer.appendChild(header);
    
    // Thống kê tổng quan
    const overviewSection = document.createElement('div');
    overviewSection.style.marginBottom = '30px';
    
    const overviewTitle = document.createElement('h2');
    overviewTitle.textContent = '1. Thống kê tổng quan';
    overviewTitle.style.fontSize = '18px';
    overviewTitle.style.color = '#2c3e50';
    overviewTitle.style.borderBottom = '2px solid #3498db';
    overviewTitle.style.paddingBottom = '5px';
    overviewSection.appendChild(overviewTitle);
    
    // Tạo bảng thống kê
    const totalRevenue = Number(data.totalRevenue) || 0;
    const completedOrders = Number(data.orderStats?.COMPLETED) || 0;
    const totalOrders = Object.values(data.orderStats || {}).reduce((a, b) => a + Number(b) || 0, 0);
    const completionRate = totalOrders ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
    
    const statsTable = document.createElement('table');
    statsTable.style.width = '100%';
    statsTable.style.borderCollapse = 'collapse';
    statsTable.style.marginTop = '15px';
    
    // Header row
    const statsHeader = document.createElement('tr');
    ['Chỉ số', 'Giá trị'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.backgroundColor = '#3498db';
      th.style.color = 'white';
      th.style.padding = '10px';
      th.style.textAlign = 'left';
      statsHeader.appendChild(th);
    });
    statsTable.appendChild(statsHeader);
    
    // Data rows
    [
      ['Tổng doanh thu', `${totalRevenue.toLocaleString('vi-VN')}đ`],
      ['Tổng số đơn hàng', totalOrders],
      ['Tỉ lệ hoàn thành', `${completionRate}%`]
    ].forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      
      row.forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        tr.appendChild(td);
      });
      
      statsTable.appendChild(tr);
    });
    
    overviewSection.appendChild(statsTable);
    reportContainer.appendChild(overviewSection);
    
    // Top 10 món ăn bán chạy
    const topItemsSection = document.createElement('div');
    topItemsSection.style.marginBottom = '30px';
    
    const topItemsTitle = document.createElement('h2');
    topItemsTitle.textContent = '2. Top 10 món bán chạy';
    topItemsTitle.style.fontSize = '18px';
    topItemsTitle.style.color = '#2c3e50';
    topItemsTitle.style.borderBottom = '2px solid #3498db';
    topItemsTitle.style.paddingBottom = '5px';
    topItemsSection.appendChild(topItemsTitle);
    
    // Tạo bảng top items
    const topItemsTable = document.createElement('table');
    topItemsTable.style.width = '100%';
    topItemsTable.style.borderCollapse = 'collapse';
    topItemsTable.style.marginTop = '15px';
    
    // Header row
    const topItemsHeader = document.createElement('tr');
    ['Tên món', 'Số lượng', 'Doanh thu'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.backgroundColor = '#3498db';
      th.style.color = 'white';
      th.style.padding = '10px';
      th.style.textAlign = 'left';
      topItemsHeader.appendChild(th);
    });
    topItemsTable.appendChild(topItemsHeader);
    
    // Data rows
    data.topSellingItems.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      
      [
        item.foodName,
        (Number(item.totalQuantity) || 0).toString(),
        `${(Number(item.totalRevenue) || 0).toLocaleString('vi-VN')}đ`
      ].forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        tr.appendChild(td);
      });
      
      topItemsTable.appendChild(tr);
    });
    
    topItemsSection.appendChild(topItemsTable);
    reportContainer.appendChild(topItemsSection);
    
    // Doanh thu theo danh mục
    const categorySection = document.createElement('div');
    categorySection.style.marginBottom = '30px';
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = '3. Doanh thu theo danh mục';
    categoryTitle.style.fontSize = '18px';
    categoryTitle.style.color = '#2c3e50';
    categoryTitle.style.borderBottom = '2px solid #3498db';
    categoryTitle.style.paddingBottom = '5px';
    categorySection.appendChild(categoryTitle);
    
    // Tạo bảng danh mục
    const categoryTable = document.createElement('table');
    categoryTable.style.width = '100%';
    categoryTable.style.borderCollapse = 'collapse';
    categoryTable.style.marginTop = '15px';
    
    // Header row
    const categoryHeader = document.createElement('tr');
    ['Danh mục', 'Số đơn hàng', 'Doanh thu'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.backgroundColor = '#3498db';
      th.style.color = 'white';
      th.style.padding = '10px';
      th.style.textAlign = 'left';
      categoryHeader.appendChild(th);
    });
    categoryTable.appendChild(categoryHeader);
    
    // Data rows
    data.revenueByCategory.forEach((cat, index) => {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      
      [
        cat.categoryName,
        (Number(cat.orderCount) || 0).toString(),
        `${(Number(cat.totalRevenue) || 0).toLocaleString('vi-VN')}đ`
      ].forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        tr.appendChild(td);
      });
      
      categoryTable.appendChild(tr);
    });
    
    categorySection.appendChild(categoryTable);
    reportContainer.appendChild(categorySection);
    
    // Footer
    const footer = document.createElement('div');
    footer.style.textAlign = 'right';
    footer.style.marginTop = '30px';
    footer.style.fontSize = '10px';
    footer.style.color = '#7f8c8d';
    
    const footerText = document.createElement('p');
    footerText.textContent = `Báo cáo được tạo vào: ${moment().format('DD/MM/YYYY HH:mm')}`;
    footer.appendChild(footerText);
    
    reportContainer.appendChild(footer);
    
    // Thêm container vào document để render
    document.body.appendChild(reportContainer);
    
    // Sử dụng html2canvas để capture thành canvas
    const canvas = await html2canvas(reportContainer, {
      scale: 2, // Tăng scale để có chất lượng cao hơn
      useCORS: true,
      logging: false,
      backgroundColor: 'white'
    });
    
    // Tạo PDF từ canvas
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    
    // Trang đầu tiên
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Thêm các trang tiếp theo nếu cần
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Thêm số trang
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Trang ${i} / ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }
    
    // Xóa container tạm
    document.body.removeChild(reportContainer);
    
    // Lưu file
    const filename = `bao-cao-doanh-thu-${moment().format('DD-MM-YYYY')}.pdf`;
    doc.save(filename);
    console.log('PDF generated successfully');
    
    return filename;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateExcelReport = async (data) => {
  try {
    console.log('Generating Excel with data:', data);
    
    const XLSX = await import('xlsx');
    
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    const overviewData = [
      ['BÁO CÁO DOANH THU'],
      [],
      ['1. Thống kê tổng quan'],
      ['Chỉ số', 'Giá trị'],
      ['Tổng doanh thu', `${(Number(data.totalRevenue) || 0).toLocaleString('vi-VN')}đ`],
      ['Tổng số đơn hàng', Number(data.orderStats?.COMPLETED) || 0],
      ['Đơn hàng hoàn thành', Number(data.orderStats?.COMPLETED) || 0],
      ['Đơn hàng đã hủy', Number(data.orderStats?.CANCELLED) || 0],
      ['Đơn hàng đang chờ', Number(data.orderStats?.PENDING) || 0],
    ];
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);

    // Sheet 2: Chi tiết doanh thu theo thời gian
    const timeData = [
      ['2. Doanh thu theo thời gian'],
      ['Thời gian', 'Doanh thu (VNĐ)'],
      ...Object.entries(data.revenueByTime || {}).map(([time, revenue]) => [
        time,
        Number(revenue) || 0
      ])
    ];
    const wsTime = XLSX.utils.aoa_to_sheet(timeData);

    // Sheet 3: Top món ăn bán chạy
    const topItemsData = [
      ['3. Top món ăn bán chạy'],
      ['Tên món', 'Số lượng đã bán', 'Doanh thu (VNĐ)'],
      ...data.topSellingItems.map(item => [
        item.foodName,
        Number(item.totalQuantity) || 0,
        Number(item.totalRevenue) || 0
      ])
    ];
    const wsTopItems = XLSX.utils.aoa_to_sheet(topItemsData);

    // Sheet 4: Doanh thu theo danh mục
    const categoryData = [
      ['4. Doanh thu theo danh mục'],
      ['Danh mục', 'Số đơn hàng', 'Doanh thu (VNĐ)'],
      ...data.revenueByCategory.map(cat => [
        cat.categoryName,
        Number(cat.orderCount) || 0,
        Number(cat.totalRevenue) || 0
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
    console.log('Excel file generated successfully');
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw error;
  }
};
