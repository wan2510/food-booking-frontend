// import { Table, Button } from "antd";
// import { useEffect, useState } from "react";
// import handleService from "./handleService";
// import AccountModal from "./AccountModal";
// import ActionButtons from "./ActionButtons";
// import LogModal from "./LogModal";

// const AccountTable = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [logModalVisible, setLogModalVisible] = useState(false);
//     const [userLogs, setUserLogs] = useState([]);

//     const fetchUsers = async () => {
//         setLoading(true);
//         const data = await handleService.getAllUsers();
//         setUsers(data);
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     // Xem lịch sử hoạt động
//     const handleViewLogs = async (userId) => {
//         const logs = await handleService.getUserLogs(userId);
//         setUserLogs(logs);
//         setLogModalVisible(true);
//     };

//     // Kích hoạt / Vô hiệu hóa tài khoản
//     const handleStatusChange = async (id, status) => {
//         setUsers((prevUsers) =>
//             prevUsers.map((user) => (user.id === id ? { ...user, status } : user))
//         );
//         await handleService.updateUserStatus(id, status);
//     };

//     return (
//         <>
//             <Button type="primary" onClick={() => setModalVisible(true)}>
//                 + Thêm Tài Khoản
//             </Button>
//             <Table
//                 dataSource={users}
//                 columns={[
//                     { title: "Họ tên", dataIndex: "full_name", key: "full_name" },
//                     { title: "Email", dataIndex: "email", key: "email" },
//                     { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
//                     { title: "Trạng thái", dataIndex: "status", key: "status" },
//                     { title: "Vai trò", dataIndex: "role", key: "role" },
//                     { title: "Ngày tạo", dataIndex: "created_at", key: "created_at" },
//                     { title: "Cập nhật lần cuối", dataIndex: "update_at", key: "update_at" },
//                     {
//                         title: "Hành động",
//                         key: "actions",
//                         render: (_, record) => (
//                             <>
//                                 <Button onClick={() => handleViewLogs(record.id)}>
//                                     Lịch sử hoạt động
//                                 </Button>
//                                 <ActionButtons
//                                     onActivate={() => handleStatusChange(record.id, "active")}
//                                     onDeactivate={() => handleStatusChange(record.id, "inactive")}
//                                     isActive={record.status === "active"}
//                                 />
//                             </>
//                         ),
//                     },
//                 ]}
//                 loading={loading}
//                 rowKey="id"
//             />
//             {modalVisible && (
//                 <AccountModal
//                     visible={modalVisible}
//                     onCancel={() => setModalVisible(false)}
//                     onSubmit={fetchUsers} 
//                 />
//             )}
//             {logModalVisible && (
//                 <LogModal
//                     visible={logModalVisible}
//                     onCancel={() => setLogModalVisible(false)}
//                     logs={userLogs}
//                 />
//             )}
//         </>
//     );
// };

// export default AccountTable;
