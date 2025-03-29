import React from "react";
import { Typography } from "antd";

const qrImageUrl = "/public/images/QRNDM.jpg";

const { Title, Text } = Typography;

const QRPayment = ({ order }) => {
  const finalTotal = order?.finalTotal || 0;
  const orderId = order?.id || Date.now();

  return (
    <div style={{ textAlign: "center" }}>
      <Title level={5}>Quét mã QR để thanh toán</Title>
      <img
        src={qrImageUrl}
        alt="QR Code Thanh Toán"
        style={{ width: 350, height: 350, marginBottom: 16 }} // Tăng kích thước lên 350x350px
      />
      <Text style={{ display: "block" }}>
        Số tiền: {finalTotal.toLocaleString("vi-VN")} VND
      </Text>
      <Text style={{ display: "block" }}>
        Mã đơn: {orderId}
      </Text>
    </div>
  );
};

export default QRPayment;