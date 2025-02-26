// import React, { useState } from "react";
// import { Row, Col, Layout } from "antd";
// import Handle from "./handleOrderFood";

// import ModalBill from "./modalBill";

// const { Content } = Layout;

// const menuItems = [
//   { id: 1, name: "Pizza", price: 150000, image: "https://via.placeholder.com/150" },
//   { id: 2, name: "Burger", price: 80000, image: "https://via.placeholder.com/150" },
//   { id: 3, name: "Sushi", price: 200000, image: "https://via.placeholder.com/150" },
// ];

// const OrderPage = () => {
//   const [bill, setBill] = useState([]);

//   const addToBill = (item) => {
//     setBill((prev) => {
//       const existingItem = prev.find((i) => i.id === item.id);
//       if (existingItem) {
//         return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
//       }
//       return [...prev, { ...item, quantity: 1, size: "M" }];
//     });
//   };

//   const updateItem = (id, quantity) => {
//     setBill((prev) => {
//       if (quantity === 0) {
//         return prev.filter((item) => item.id !== id);
//       }
//       return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
//     });
//   };

//   return (
//     <Layout>
//       <Content style={{ padding: "20px" }}> <h1>HEADER</h1>{/* Chừa khoảng trống cho header */}
//         <Row gutter={16}>
//           <Col span={12}>
//             <h2>Menu</h2>
//             <OrderingFood menuItems={menuItems} addToBill={addToBill} />
//           </Col>
//           <Col span={12}>
//             <h2>Hóa đơn</h2>
//             <ModalBill bill={bill} updateItem={updateItem} />
//           </Col>
//         </Row>
//       </Content>
//     </Layout>
//   );
// };

// export default OrderPage;