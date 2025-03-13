// import { Modal, Table } from "antd";

// const LogModal = ({ visible, onCancel, logs }) => {
//     const columns = [
//         { title: "Loại", dataIndex: "action", key: "action" },
//         { title: "Thời gian", dataIndex: "timestamp", key: "timestamp" },
//     ];

//     return (
//         <Modal
//             title="Lịch sử hoạt động"
//             open={visible}
//             onCancel={onCancel}
//             footer={null}
//             width={600}
//         >
//             <Table
//                 dataSource={logs}
//                 columns={columns}
//                 rowKey="timestamp" // Fix lỗi không có "id"
//                 pagination={{ pageSize: 5 }}
//             />
//         </Modal>
//     );
// };

// export default LogModal;
