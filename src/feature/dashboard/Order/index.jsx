import React, { useState, useEffect } from "react";
import { Row, Col, Layout, Typography, Card, Button, message } from "antd";
import HandleOrderFood from "./handleOrderFood/HandleOrderFood";
import ModalPurchase from "./modalPurchase/ModalPurchase";
import ModalBill from "./modalBill/ModalBill";
import { getState, subscribe, getMenuItems, getFoodCategories, getTables, getVouchers, addToBill, updateItem, setSelectedTable, setSelectedVoucher, setPaymentMethod, setCashReceived, validateBeforeCreate, clearOrder, getTotalPrice, getDiscount, getFinalPrice } from "./OrderApi";
import "./Order.css";

const { Content } = Layout;
const { Title } = Typography;

const Order = ({ user }) => {
  const [state, setState] = useState(getState());
  const [menuItems, setMenuItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe((newState) => setState(newState));

    const fetchInitialData = async () => {
      try {
        const [menuItemsData, foodCategoriesData, tablesData, vouchersData] = await Promise.all([
          getMenuItems(),
          getFoodCategories(),
          getTables(),
          getVouchers(),
        ]);
        setMenuItems(menuItemsData);
        setFoodCategories(foodCategoriesData);
        setTables(tablesData);
        setVouchers(vouchersData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("Không thể tải dữ liệu ban đầu!");
      }
    };

    fetchInitialData();

    return unsubscribe;
  }, []);

  const handleCreateBill = async () => {
    const validation = await validateBeforeCreate();
    if (validation.success) {
      setState({ ...state, isPaymentModalOpen: true });
      message.success("Hóa đơn đã được tạo!");
    }
  };

  const handleConfirmPayment = async () => {
    const totalPrice = getTotalPrice();
    const discount = getDiscount();
    const finalPrice = getFinalPrice();

    if (state.paymentMethod === "Tiền mặt") {
      if (state.cashReceived < finalPrice) {
        message.error("Số tiền khách đưa không đủ để thanh toán!");
        return;
      }
      message.success(
        `Thanh toán thành công! Tiền trả lại: ${(state.cashReceived - finalPrice).toLocaleString("vi-VN")} VND`
      );
    } else {
      message.success("Thanh toán qua chuyển khoản thành công!");
    }

    // Tạo hóa đơn và reset
    await clearOrder();
    setState({ ...state, isPaymentModalOpen: false, cashReceived: 0 }); // Reset cashReceived
  };

  const handleCancelPayment = () => {
    setState({ ...state, isPaymentModalOpen: false });
    message.info("Thanh toán đã bị hủy!");
  };

  return (
    <Layout className="order-page">
      <Content className="order-content">
        <Row gutter={16} className="order-container">
          <Col span={16}>
            <Card className="menu-container">
              <Title level={2}>Menu</Title>
              <HandleOrderFood
                menuItems={menuItems}
                addToBill={addToBill}
                foodCategories={foodCategories}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card className="bill-container">
              <Title level={2}>Hóa đơn</Title>
              <ModalBill
                bill={state.bill}
                updateItem={updateItem}
                vouchers={vouchers}
                tables={tables}
                selectedTable={state.selectedTable}
                setSelectedTable={setSelectedTable}
                selectedVoucher={state.selectedVoucher}
                setSelectedVoucher={setSelectedVoucher}
              />
              <Button type="primary" onClick={handleCreateBill} block style={{ marginTop: 16 }}>
                Tạo hóa đơn
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>

      <ModalPurchase
        visible={state.isPaymentModalOpen}
        onCancel={handleCancelPayment}
        onConfirm={handleConfirmPayment}
        bill={state.bill}
        vouchers={vouchers}
        selectedTable={state.selectedTable}
        selectedVoucher={state.selectedVoucher}
        paymentMethod={state.paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cashReceived={state.cashReceived}
        setCashReceived={setCashReceived}
      />
    </Layout>
  );
};

export default Order;