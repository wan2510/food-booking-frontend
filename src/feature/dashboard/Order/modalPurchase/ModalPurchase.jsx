import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Button, Input } from "antd";
import ModalBillReadOnly from "../modalBill/ModalBillReadOnly";
import HandleQRPayment from "./HandleQRPayment";
import HandleSelectMethod from "./HandleSelectMethod";
import { getTotalPrice, getDiscount, getFinalPrice } from "../OrderApi";

const ModalPurchase = ({
  visible,
  onCancel,
  onConfirm,
  bill,
  vouchers,
  selectedTable,
  selectedVoucher,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
}) => {
  const totalPrice = getTotalPrice();
  const discount = getDiscount();
  const finalPrice = getFinalPrice();

  const order = {
    id: Date.now(),
    table: selectedTable,
    customer_name: "Khách vãng lai",
    items: bill,
    total: totalPrice,
    discount,
    finalTotal: finalPrice,
    created_at: new Date().toISOString(),
  };

  const handleCashChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCashReceived(value ? parseInt(value, 10) : 0);
  };

  const changeAmount = cashReceived >= finalPrice ? cashReceived - finalPrice : 0;

  useEffect(() => {
    if (visible) {
      setCashReceived(0);
    }
  }, [visible, setCashReceived]);

  return (
    <Modal
      title="Thanh toán Hóa đơn"
      open={visible} // Thay 'visible' bằng 'open'
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ModalBillReadOnly
            bill={bill}
            selectedTable={selectedTable}
            selectedVoucher={selectedVoucher}
            vouchers={vouchers}
          />
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <HandleSelectMethod value={paymentMethod} onChange={setPaymentMethod} />
          {paymentMethod === "Tiền mặt" ? (
            <>
              <Input
                placeholder="Nhập số tiền khách đưa (VND)"
                value={cashReceived ? cashReceived.toLocaleString("vi-VN") : ""}
                onChange={handleCashChange}
                onBlur={handleCashChange}
                style={{ marginTop: 16, width: "100%", textAlign: "right" }}
                allowClear
                autoFocus
              />
              {cashReceived > 0 && (
                <>
                  {cashReceived < finalPrice ? (
                    <div style={{ color: "red", marginTop: 8 }}>
                      Số tiền không đủ! Còn thiếu {(finalPrice - cashReceived).toLocaleString("vi-VN")} VND
                    </div>
                  ) : (
                    <div style={{ color: "green", marginTop: 8 }}>
                      Tiền trả lại: {changeAmount.toLocaleString()} VND
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <HandleQRPayment order={order} />
          )}
        </Col>
      </Row>
      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={onConfirm} disabled={finalPrice > cashReceived && paymentMethod === "Tiền mặt"}>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ModalPurchase;