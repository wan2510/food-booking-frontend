// import { Form, Button, Select, message, Input } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserById, updateUserStatus } from "./handleService";

// const AccountActions = () => {
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (id) {
//             getUserById(id)
//                 .then((data) => {
//                     if (data) {
//                         form.setFieldsValue({
//                             full_name: data.full_name || "Không có dữ liệu",
//                             email: data.email || "Không có dữ liệu",
//                             phone: data.phone || "Không có dữ liệu",
//                             status: data.status || "inactive",
//                             role: data.role_id || "Không xác định",
//                         });
//                     }
//                 })
//                 .catch(() => {
//                     message.error("Lỗi khi tải dữ liệu người dùng!");
//                 });
//         }
//     }, [id, form]);

//     const handleSubmit = async (values) => {
//         setLoading(true);
//         try {
//             await updateUserStatus(id, values.status);
//             message.success("Cập nhật trạng thái tài khoản thành công!");
//             navigate("/admin/account-user");
//         } catch {
//             message.error("Lỗi khi cập nhật trạng thái tài khoản!");
//         }
//         setLoading(false);
//     };

//     return (
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//             <Form.Item name="full_name" label="Họ tên">
//                 <Input disabled />
//             </Form.Item>
//             <Form.Item name="email" label="Email">
//                 <Input disabled />
//             </Form.Item>
//             <Form.Item name="phone" label="Số điện thoại">
//                 <Input disabled />
//             </Form.Item>
//             <Form.Item name="role" label="Vai trò">
//                 <Input disabled />
//             </Form.Item>
//             <Form.Item name="status" label="Trạng thái">
//                 <Select>
//                     <Select.Option value="active">Hoạt động</Select.Option>
//                     <Select.Option value="inactive">Bị khóa</Select.Option>
//                 </Select>
//             </Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading}>
//                 Cập nhật trạng thái
//             </Button>
//         </Form>
//     );
// };

// export default AccountActions;
