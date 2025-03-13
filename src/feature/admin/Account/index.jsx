// import { useState } from "react";
// import { Button, Input } from "antd";
// import AccountTable from "./AccountTable";
// import AccountModal from "./AccountModal";
// import "./Account.css";

// const Account = () => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedUser, setSelectedUser] = useState(null);

//     const handleOpenModal = (user) => {
//         setSelectedUser(user);
//         setModalVisible(true);
//     };

//     const handleCloseModal = () => {
//         setSelectedUser(null);
//         setModalVisible(false);
//     };

//     return (
//         <div className="account-container">
//             <div className="header">
//                 <h2>Quản lý tài khoản</h2>
//                 <div className="actions">
//                     <Input
//                         placeholder="Tìm kiếm tài khoản..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{ width: 250, marginRight: 10 }}
//                     />
//                     <Button type="primary" onClick={() => handleOpenModal(null)}>
//                         + Thêm Tài Khoản
//                     </Button>
//                 </div>
//             </div>
//             <AccountTable searchTerm={searchTerm} onEdit={handleOpenModal} />
//             {modalVisible && (
//                 <AccountModal
//                     visible={modalVisible}
//                     onCancel={handleCloseModal}
//                     initialValues={selectedUser}
//                 />
//             )}
//         </div>
//     );
// };

// export default Account;
