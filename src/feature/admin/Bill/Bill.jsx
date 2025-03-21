import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Modal, Card, Statistic, Row, Col, Form, DatePicker, message, Space, Collapse } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

// URL cơ bản của backend
const API_BASE_URL = 'http://localhost:8080/api/invoice';

const Bill = () => {
  const [form] = Form.useForm();
  const [advancedSearchForm] = Form.useForm();
  const [pastPaidSearchForm] = Form.useForm();
  const invoiceStatuses = ['Tất cả', 'Đang xử lý', 'Đã thanh toán', 'Chưa thanh toán', 'Đã hủy'];

  const [invoices, setInvoices] = useState([]);
  const [pastPaidInvoices, setPastPaidInvoices] = useState([]);
  const [paidByDateStats, setPaidByDateStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'Tất cả',
    type: 'Tất cả',
    searchTerm: '',
    dateRange: null,
  });
  const [pastPaidFilters, setPastPaidFilters] = useState({
    dateRange: null,
    searchTerm: '',
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
  const [isPastPaidSearchVisible, setIsPastPaidSearchVisible] = useState(false);

  // Lấy danh sách hóa đơn từ API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status && filters.status !== 'Tất cả') params.status = filters.status;
      if (filters.type && filters.type !== 'Tất cả') params.type = filters.type;
      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      if (filters.dateRange) {
        params.startDate = moment(filters.dateRange[0]).format('YYYY-MM-DD');
        params.endDate = moment(filters.dateRange[1]).format('YYYY-MM-DD');
      }

      const response = await axios.get(API_BASE_URL, { params });
      setInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy hóa đơn đã thanh toán trước đây từ API
  const fetchPastPaidInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (pastPaidFilters.searchTerm) params.searchTerm = pastPaidFilters.searchTerm;
      if (pastPaidFilters.dateRange) {
        params.startDate = moment(pastPaidFilters.dateRange[0]).format('YYYY-MM-DD');
        params.endDate = moment(pastPaidFilters.dateRange[1]).format('YYYY-MM-DD');
      }

      const response = await axios.get(`${API_BASE_URL}/past-paid`, { params });
      setPastPaidInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching past paid invoices:', error);
      message.error('Không thể tải hóa đơn đã thanh toán. Vui lòng kiểm tra server!');
      setPastPaidInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê hóa đơn đã thanh toán theo ngày từ API
  const fetchPaidByDateStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/paid-by-date`);
      setPaidByDateStats(response.data || []);
    } catch (error) {
      console.error('Error fetching paid by date stats:', error);
      message.error('Không thể tải thống kê. Vui lòng kiểm tra server!');
      setPaidByDateStats([]);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchInvoices();
    fetchPastPaidInvoices();
    fetchPaidByDateStats();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  useEffect(() => {
    fetchPastPaidInvoices();
  }, [pastPaidFilters]);

  const handleAddInvoice = async (values) => {
    setLoading(true);
    try {
      const newInvoice = {
        customer: values.customer,
        amount: parseFloat(values.amount),
        date: values.date.format('YYYY-MM-DD'),
        type: values.type,
      };
      const response = await axios.post(API_BASE_URL, newInvoice);
      setInvoices([...invoices, response.data]);
      setIsAddModalVisible(false);
      form.resetFields();
      message.success('Đặt đơn thành công!');
      fetchInvoices();
      fetchPastPaidInvoices();
    } catch (error) {
      console.error('Error adding invoice:', error);
      message.error(error.response?.data?.message || 'Lỗi khi thêm hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, value) => {
    setLoading(true);
    try {
        await axios.put(`${API_BASE_URL}/${id}/status?status=${value}`);
        message.success('Cập nhật trạng thái thành công');
        if (value === 'Đã thanh toán') {
            message.success('Thanh toán thành công!');
        }
        // Gọi lại cả fetchInvoices và fetchPastPaidInvoices để làm mới dữ liệu từ DB
        await Promise.all([fetchInvoices(), fetchPastPaidInvoices()]);
    } catch (error) {
        console.error('Error updating status:', error);
        message.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
        setLoading(false);
    }
};

  const handleDeleteInvoice = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${API_BASE_URL}/${id}`);
          setInvoices(invoices.filter(invoice => invoice.id !== id));
          message.success('Xóa hóa đơn thành công');
          fetchPastPaidInvoices();
        } catch (error) {
          console.error('Error deleting invoice:', error);
          message.error(error.response?.data?.message || 'Lỗi khi xóa hóa đơn');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showDetails = async (invoice) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${invoice.id}`);
      setSelectedInvoice(response.data);
      setIsDetailsModalVisible(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      message.error(error.response?.data?.message || 'Lỗi khi lấy chi tiết hóa đơn');
    }
  };

  const handleAdvancedSearch = (values) => {
    const newFilters = {
      ...filters,
      status: values.status || 'Tất cả',
      type: values.type || 'Tất cả',
      dateRange: values.dateRange ? [values.dateRange[0], values.dateRange[1]] : null,
    };
    setFilters(newFilters);
    setIsAdvancedSearchVisible(false);
  };

  const resetAdvancedSearch = () => {
    advancedSearchForm.resetFields();
    setFilters({
      status: 'Tất cả',
      type: 'Tất cả',
      searchTerm: '',
      dateRange: null,
    });
  };

  const handlePastPaidSearch = (values) => {
    const newFilters = {
      ...pastPaidFilters,
      dateRange: values.dateRange ? [values.dateRange[0], values.dateRange[1]] : null,
      searchTerm: values.searchTerm || '',
    };
    setPastPaidFilters(newFilters);
    setIsPastPaidSearchVisible(false);
  };

  const resetPastPaidSearch = () => {
    pastPaidSearchForm.resetFields();
    setPastPaidFilters({
      dateRange: null,
      searchTerm: '',
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount ? amount.toLocaleString() : '0'),
    },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={type === 'Xuất' ? 'px-2 py-1 rounded bg-green-100' : 'px-2 py-1 rounded bg-blue-100'}>
          {type}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          className="w-32"
        >
          {invoiceStatuses.filter(s => s !== 'Tất cả').map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            className="mr-2"
            type="primary"
            ghost
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteInvoice(record.id)}
          />
        </div>
      ),
    },
  ];

  const pastPaidColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount ? amount.toLocaleString() : '0'),
    },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={type === 'Xuất' ? 'px-2 py-1 rounded bg-green-100' : 'px-2 py-1 rounded bg-blue-100'}>
          {type}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => showDetails(record)}
          type="primary"
          ghost
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Bộ lọc chính */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              className="w-full"
              placeholder="Chọn trạng thái"
            >
              {invoiceStatuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
              className="w-full"
              placeholder="Chọn loại hóa đơn"
            >
              <Option value="Tất cả">Tất cả</Option>
              <Option value="Xuất">Xuất</Option>
              <Option value="Nhập">Nhập</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Tìm khách hàng hoặc ID..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => setIsAdvancedSearchVisible(true)}
              >
                Tìm kiếm nâng cao
              </Button>
              {(filters.dateRange || filters.status !== 'Tất cả' || filters.type !== 'Tất cả' || filters.searchTerm) && (
                <Button onClick={resetAdvancedSearch}>Xóa bộ lọc</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Modal tìm kiếm nâng cao */}
      <Modal
        title="Tìm kiếm hóa đơn nâng cao"
        open={isAdvancedSearchVisible}
        onCancel={() => setIsAdvancedSearchVisible(false)}
        footer={null}
      >
        <Form
          form={advancedSearchForm}
          layout="vertical"
          onFinish={handleAdvancedSearch}
          initialValues={{
            status: filters.status,
            type: filters.type,
            dateRange: filters.dateRange ? [moment(filters.dateRange[0]), moment(filters.dateRange[1])] : null,
          }}
        >
          <Form.Item name="dateRange" label="Khoảng thời gian">
            <RangePicker format="YYYY-MM-DD" placeholder={['Từ ngày', 'Đến ngày']} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              {invoiceStatuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại hóa đơn">
            <Select placeholder="Chọn loại">
              <Option value="Tất cả">Tất cả</Option>
              <Option value="Xuất">Xuất</Option>
              <Option value="Nhập">Nhập</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Row gutter={16} justify="end">
              <Col>
                <Button onClick={() => advancedSearchForm.resetFields()}>Đặt lại</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">Áp dụng</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      {/* Nút thêm hóa đơn */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddModalVisible(true)}
        className="mb-6"
      >
        Thêm hóa đơn
      </Button>

      {/* Modal thêm hóa đơn */}
      <Modal
        title="Thêm hóa đơn mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddInvoice}
        >
          <Form.Item name="customer" label="Khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Số tiền (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="type" label="Loại" initialValue="Xuất">
            <Select>
              <Option value="Xuất">Xuất</Option>
              <Option value="Nhập">Nhập</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Thêm hóa đơn
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng danh sách hóa đơn */}
      <Table
        columns={columns}
        dataSource={invoices}
        rowKey="id"
        loading={loading}
        className="mb-6"
      />

      {/* Modal chi tiết hóa đơn */}
      <Modal
        title={`Chi tiết hóa đơn #${selectedInvoice?.id || ''}`}
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedInvoice && (
          <div>
            <p><strong>Khách hàng:</strong> {selectedInvoice.customer}</p>
            <p><strong>Số tiền:</strong> {selectedInvoice.amount.toLocaleString()} VNĐ</p>
            <p><strong>Ngày:</strong> {selectedInvoice.date}</p>
            <p><strong>Loại:</strong> {selectedInvoice.type}</p>
            <p><strong>Trạng thái:</strong> {selectedInvoice.status}</p>
          </div>
        )}
      </Modal>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Đã thanh toán"
            value={invoices.filter(i => i.status === 'Đã thanh toán').length}
            className="bg-green-50 p-4 rounded"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Chưa thanh toán"
            value={invoices.filter(i => i.status === 'Chưa thanh toán').length}
            className="bg-yellow-50 p-4 rounded"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Đã hủy"
            value={invoices.filter(i => i.status === 'Đã hủy').length}
            className="bg-red-50 p-4 rounded"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tổng số tiền"
            value={invoices.reduce((sum, i) => sum + (i.amount || 0), 0)}
            suffix="VNĐ"
            className="bg-blue-50 p-4 rounded"
            formatter={(value) => value.toLocaleString()}
          />
        </Col>
      </Row>

      {/* Thống kê hóa đơn đã thanh toán theo ngày */}
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Thống kê hóa đơn đã thanh toán theo ngày',
            children: (
              <Table
                columns={[
                  { title: 'Ngày', dataIndex: 'date', key: 'date' },
                  { title: 'Số lượng hóa đơn', dataIndex: 'count', key: 'count' },
                  {
                    title: 'Tổng số tiền (VNĐ)',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (amount) => (amount ? amount.toLocaleString() : '0'),
                  },
                ]}
                dataSource={paidByDateStats}
                rowKey="date"
                pagination={false}
              />
            ),
          },
        ]}
        className="mb-6"
      />

      {/* Hóa đơn đã thanh toán trước đây */}
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Hóa đơn đã thanh toán trước những ngày trước',
            children: (
              <>
                <Row gutter={[16, 16]} align="middle" className="mb-4">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Input
                      placeholder="Tìm khách hàng hoặc ID..."
                      value={pastPaidFilters.searchTerm}
                      onChange={(e) => setPastPaidFilters({ ...pastPaidFilters, searchTerm: e.target.value })}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => setIsPastPaidSearchVisible(true)}
                      >
                        Tìm kiếm nâng cao
                      </Button>
                      {(pastPaidFilters.dateRange || pastPaidFilters.searchTerm) && (
                        <Button onClick={resetPastPaidSearch}>Xóa bộ lọc</Button>
                      )}
                    </Space>
                  </Col>
                </Row>

                <Modal
                  title="Tìm kiếm hóa đơn đã thanh toán trước những ngày trước"
                  open={isPastPaidSearchVisible}
                  onCancel={() => setIsPastPaidSearchVisible(false)}
                  footer={null}
                >
                  <Form
                    form={pastPaidSearchForm}
                    layout="vertical"
                    onFinish={handlePastPaidSearch}
                    initialValues={{
                      dateRange: pastPaidFilters.dateRange ? [moment(pastPaidFilters.dateRange[0]), moment(pastPaidFilters.dateRange[1])] : null,
                      searchTerm: pastPaidFilters.searchTerm,
                    }}
                  >
                    <Form.Item name="dateRange" label="Khoảng thời gian">
                      <RangePicker
                        format="YYYY-MM-DD"
                        placeholder={['Từ ngày', 'Đến ngày']}
                        disabledDate={(current) => current && current > moment().subtract(3, 'days').endOf('day')}
                      />
                    </Form.Item>
                    <Form.Item name="searchTerm" label="Tìm kiếm khách hàng hoặc ID">
                      <Input placeholder="Nhập khách hàng hoặc ID..." allowClear />
                    </Form.Item>
                    <Form.Item>
                      <Row gutter={16} justify="end">
                        <Col>
                          <Button onClick={() => pastPaidSearchForm.resetFields()}>Đặt lại</Button>
                        </Col>
                        <Col>
                          <Button type="primary" htmlType="submit">Áp dụng</Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </Modal>

                <Table
                  columns={pastPaidColumns}
                  dataSource={pastPaidInvoices}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Bill;