import React from "react";
import { QRCodeSVG } from "react-qr-code";
import { Typography } from "antd";

const { Title, Text } = Typography;

const QRPayment = ({ order }) => {
  const qrCodeData = JSON.stringify({
    orderId: order?.id || Date.now(),
    total: order?.finalTotal || 0,
    paymentUrl: `https://payment.example.com/pay?orderId=${order?.id || Date.now()}&amount=${order?.finalTotal || 0}`,
  });

  return (
    <div>
      <Title level={5}>Quét mã QR để thanh toán</Title>
      <QRCodeSVG value={qrCodeData} size={150} />
      <Text style={{ display: "block", marginTop: 16 }}>
        Số tiền: {order?.finalTotal?.toLocaleString("vi-VN") || "0"} VND
      </Text>
    </div>
  );
};

export default QRPayment;