import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Modal, Card, Statistic, Row, Col, Form, DatePicker, message, Space, Collapse } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/invoice';
const { Option } = Select;
const { RangePicker } = DatePicker;

const Bill = () => {
  const [form] = Form.useForm();
  const [advancedSearchForm] = Form.useForm();
  const [pastPaidSearchForm] = Form.useForm();

  const invoiceStatuses = [
    { display: 'Tất cả', value: 'Tất cả' },
    { display: 'Đang xử lý', value: 'Đang xử lý' },
    { display: 'Đã thanh toán', value: 'Đã thanh toán' },
    { display: 'Chưa thanh toán', value: 'Chưa thanh toán' },
    { display: 'Đã hủy', value: 'Đã hủy' },
  ];

  const [invoices, setInvoices] = useState([]);
  const [pastPaidInvoices, setPastPaidInvoices] = useState([]);
  const [paidByDateStats, setPaidByDateStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'Tất cả', type: 'Tất cả', searchTerm: '', dateRange: null });
  const [pastPaidFilters, setPastPaidFilters] = useState({ dateRange: null, searchTerm: '' });
  const [statsDateRange, setStatsDateRange] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
  const [isPastPaidSearchVisible, setIsPastPaidSearchVisible] = useState(false);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });

  const formatDate = (date) => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status && filters.status !== 'Tất cả') params.status = filters.status;
      if (filters.type && filters.type !== 'Tất cả') params.type = filters.type;
      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      if (filters.dateRange) {
        params.startDate = formatDate(filters.dateRange[0]);
        params.endDate = formatDate(filters.dateRange[1]);
      }

      console.log('Đang lấy danh sách hóa đơn với tham số:', params);
      const response = await axiosInstance.get('', { params });
      const data = response.data.map((item) => ({
        ...item,
        uuid: String(item.uuid),
        date: item.date ? moment(item.date).format('YYYY-MM-DD') : null,
      }));
      setInvoices(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      if (error.response) {
        console.log('Mã trạng thái:', error.response.status);
        console.log('Dữ liệu lỗi:', error.response.data);
        const errorMessage = error.response.data.errorMessage || error.response.data || 'Không thể kết nối đến server';
        message.error(`Lỗi: ${errorMessage}`);
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
      }
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastPaidInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (pastPaidFilters.searchTerm) params.searchTerm = pastPaidFilters.searchTerm;
      if (pastPaidFilters.dateRange) {
        params.startDate = formatDate(pastPaidFilters.dateRange[0]);
        params.endDate = formatDate(pastPaidFilters.dateRange[1]);
      }

      console.log('Đang lấy danh sách hóa đơn đã thanh toán với tham số:', params);
      const response = await axiosInstance.get('/past-paid', { params });
      const data = response.data.map((item) => ({
        ...item,
        uuid: String(item.uuid),
        date: item.date ? moment(item.date).format('YYYY-MM-DD') : null,
      }));
      setPastPaidInvoices(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy hóa đơn đã thanh toán:', error);
      if (error.response) {
        console.log('Mã trạng thái:', error.response.status);
        console.log('Dữ liệu lỗi:', error.response.data);
        const errorMessage = error.response.data.errorMessage || error.response.data || 'Không thể tải hóa đơn đã thanh toán';
        message.error(`Lỗi: ${errorMessage}`);
      } else {
        message.error('Không thể tải hóa đơn đã thanh toán. Vui lòng kiểm tra server!');
      }
      setPastPaidInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaidByDateStats = async () => {
    try {
      const params = {};
      if (statsDateRange) {
        params.startDate = formatDate(statsDateRange[0]);
        params.endDate = formatDate(statsDateRange[1]);
      }

      console.log('Đang lấy thống kê thanh toán theo ngày với tham số:', params);
      const response = await axiosInstance.get('/stats/paid-by-date', { params });
      const data = response.data.map((item) => ({
        ...item,
        date: item.date ? moment(item.date).format('YYYY-MM-DD') : null,
      }));
      setPaidByDateStats(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê thanh toán theo ngày:', error);
      if (error.response) {
        console.log('Mã trạng thái:', error.response.status);
        console.log('Dữ liệu lỗi:', error.response.data);
        const errorMessage = error.response.data.errorMessage || error.response.data || 'Không thể tải thống kê';
        message.error(`Lỗi: ${errorMessage}`);
      } else {
        message.error('Không thể tải thống kê. Vui lòng kiểm tra server!');
      }
      setPaidByDateStats([]);
    }
  };

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

  useEffect(() => {
    fetchPaidByDateStats();
  }, [statsDateRange]);

  const handleAddInvoice = async (values) => {
    setLoading(true);
    try {
      const invoiceData = {
        customer: values.customer,
        amount: parseFloat(values.amount),
        type: values.type,
      };
      const response = await axiosInstance.post('', invoiceData);
      const newInvoice = {
        ...response.data,
        uuid: String(response.data.uuid),
        date: response.data.date ? moment(response.data.date).format('YYYY-MM-DD') : null,
      };
      setInvoices([...invoices, newInvoice]);
      message.success('Thêm hóa đơn thành công');
      form.resetFields();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi thêm hóa đơn:', error);
      if (error.response) {
        const errorMessage = error.response.data.errorMessage || error.response.data || 'Lỗi khi thêm hóa đơn';
        message.error(`Lỗi: ${errorMessage}`);
      } else {
        message.error('Lỗi khi thêm hóa đơn');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (uuid, newStatus) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/${uuid}/status`, null, {
        params: { status: newStatus },
      });
      setInvoices(
        invoices.map((invoice) =>
          invoice.uuid === uuid ? { ...invoice, status: newStatus } : invoice
        )
      );
      message.success('Cập nhật trạng thái thành công');
      fetchPastPaidInvoices();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      if (error.response) {
        console.log('Mã trạng thái:', error.response.status);
        console.log('Dữ liệu lỗi:', error.response.data);
        const errorMessage = error.response.data.errorMessage || error.response.data || 'Lỗi khi cập nhật trạng thái';
        if (error.response.status === 404) {
          message.error('Hóa đơn không tồn tại. Vui lòng làm mới trang!');
        } else {
          message.error(`Lỗi: ${errorMessage}`);
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (uuid) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await axiosInstance.delete(`/${uuid}`);
          setInvoices(invoices.filter((invoice) => invoice.uuid !== uuid));
          message.success('Xóa hóa đơn thành công');
          fetchPastPaidInvoices();
        } catch (error) {
          console.error('Lỗi khi xóa hóa đơn:', error);
          if (error.response) {
            if (error.response.status === 404) {
              message.error('Hóa đơn không tồn tại. Vui lòng làm mới trang!');
            } else {
              const errorMessage = error.response.data.errorMessage || error.response.data || 'Lỗi khi xóa hóa đơn';
              message.error(errorMessage);
            }
          } else {
            message.error('Lỗi khi xóa hóa đơn');
          }
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showDetails = async (invoice) => {
    try {
      const response = await axiosInstance.get(`/${invoice.uuid}`);
      const detailedInvoice = {
        ...response.data,
        uuid: String(response.data.uuid),
        date: response.data.date ? moment(response.data.date).format('YYYY-MM-DD') : null,
      };
      setSelectedInvoice(detailedInvoice);
      setIsDetailsModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      if (error.response) {
        if (error.response.status === 404) {
          message.error('Hóa đơn không tồn tại. Vui lòng làm mới trang!');
        } else {
          const errorMessage = error.response.data.errorMessage || error.response.data || 'Lỗi khi lấy chi tiết hóa đơn';
          message.error(errorMessage);
        }
      } else {
        message.error('Lỗi khi lấy chi tiết hóa đơn');
      }
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
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
      sorter: (a, b) => a.uuid.localeCompare(b.uuid),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount ? amount.toLocaleString() : '0'),
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'N/A'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={type === 'Xuất' ? 'px-2 py-1 rounded bg-green-100' : 'px-2 py-1 rounded bg-blue-100'}>
          {type}
        </span>
      ),
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record.uuid, newStatus)}
          className="w-32"
        >
          {invoiceStatuses
            .filter((s) => s.value !== 'Tất cả')
            .map((s) => (
              <Option key={s.value} value={s.value}>
                {s.display}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            type="primary"
            ghost
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteInvoice(record.uuid)}
          />
        </Space>
      ),
    },
  ];

  const pastPaidColumns = [
    { title: 'ID', dataIndex: 'uuid', key: 'uuid' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount ? amount.toLocaleString() : '0'),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'N/A'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ['ascend', 'descend'],
    },
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

  const statsColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'N/A'),
    },
    { title: 'Số lượng hóa đơn', dataIndex: 'count', key: 'count' },
    {
      title: 'Tổng số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount ? amount.toLocaleString() : '0'),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              className="w-full"
              placeholder="Chọn trạng thái"
            >
              {invoiceStatuses.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.display}
                </Option>
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
              {invoiceStatuses.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.display}
                </Option>
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
                <Button type="primary" htmlType="submit">
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddModalVisible(true)}
        className="mb-6"
      >
        Thêm hóa đơn
      </Button>

      <Modal
        title="Thêm hóa đơn mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddInvoice}>
          <Form.Item
            name="customer"
            label="Khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số tiền (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
          >
            <Input type="number" min={0} />
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

      <Table
        columns={columns}
        dataSource={invoices}
        rowKey="uuid"
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
        }}
        loading={loading}
      />

      <Modal
        title={`Chi tiết hóa đơn #${selectedInvoice?.uuid || ''}`}
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
            <p>
              <strong>Khách hàng:</strong> {selectedInvoice.customer}
            </p>
            <p>
              <strong>Số tiền:</strong> {selectedInvoice.amount.toLocaleString()} VNĐ
            </p>
            <p>
              <strong>Ngày:</strong> {selectedInvoice.date ? moment(selectedInvoice.date).format('DD/MM/YYYY') : 'N/A'}
            </p>
            <p>
              <strong>Loại:</strong> {selectedInvoice.type}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedInvoice.status}
            </p>
          </div>
        )}
      </Modal>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Đã thanh toán"
            value={invoices.filter((i) => i.status === 'Đã thanh toán').length}
            className="bg-green-50 p-4 rounded"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Chưa thanh toán"
            value={invoices.filter((i) => i.status === 'Chưa thanh toán').length}
            className="bg-yellow-50 p-4 rounded"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Đã hủy"
            value={invoices.filter((i) => i.status === 'Đã hủy').length}
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

      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Thống kê hóa đơn đã thanh toán theo ngày',
            children: (
              <>
                <Row gutter={[16, 16]} align="middle" className="mb-4">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <RangePicker
                      format="YYYY-MM-DD"
                      placeholder={['Từ ngày', 'Đến ngày']}
                      value={statsDateRange ? [moment(statsDateRange[0]), moment(statsDateRange[1])] : null}
                      onChange={(dates) => setStatsDateRange(dates ? [dates[0], dates[1]] : null)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    {statsDateRange && (
                      <Button onClick={() => setStatsDateRange(null)}>Xóa bộ lọc</Button>
                    )}
                  </Col>
                </Row>
                <Table
                  columns={statsColumns}
                  dataSource={paidByDateStats}
                  rowKey="date"
                  pagination={false}
                />
              </>
            ),
          },
        ]}
        className="mb-6"
      />

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
                      dateRange: pastPaidFilters.dateRange
                        ? [moment(pastPaidFilters.dateRange[0]), moment(pastPaidFilters.dateRange[1])]
                        : null,
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
                          <Button type="primary" htmlType="submit">
                            Áp dụng
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </Modal>

                <Table
                  columns={pastPaidColumns}
                  dataSource={pastPaidInvoices}
                  rowKey="uuid"
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