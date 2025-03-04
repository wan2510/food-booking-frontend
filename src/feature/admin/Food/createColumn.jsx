import { Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const createColumns = (handleEdit, handleDelete) => [
    { title: 'Tên món', dataIndex: 'name', key: 'name' },
    { title: 'Giá ($)', dataIndex: 'price', key: 'price' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
        title: 'Đánh giá',
        dataIndex: 'rating',
        key: 'rating',
        render: (rating = 0) => (
            <span style={{ color: 'gold' }}>{'★'.repeat(rating)}</span>
        ), // Hiển thị sao, mặc định 0 sao nếu không có rating
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <>
                <Button
                    onClick={() => handleEdit(record)}
                    style={{ marginRight: 8 }}
                    icon={<EditOutlined />}
                    type="primary"
                >
                    Sửa
                </Button>

                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa không?"
                    onConfirm={() => handleDelete(record)}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button
                        style={{ color: 'white', backgroundColor: 'red' }}
                        icon={<DeleteOutlined />}
                        danger
                    >
                        Xóa
                    </Button>
                </Popconfirm>
            </>
        ),
    },
];
