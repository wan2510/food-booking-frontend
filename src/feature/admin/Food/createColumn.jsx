import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const createColumn = (showModal, onDelete) => [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <>
                <Button
                    onClick={() => showModal(record)}
                    style={{ marginRight: 8 }}
                    icon={<EditOutlined />}
                    type="primary"
                >
                    Edit
                </Button>
                <Button
                    onClick={() => onDelete(record)}
                    style={{ color: 'white', backgroundColor: 'red' }}
                    icon={<DeleteOutlined />}
                    danger
                >
                    Delete
                </Button>
            </>
        ),
    },
];
