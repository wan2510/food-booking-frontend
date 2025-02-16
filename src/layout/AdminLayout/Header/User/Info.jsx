import { UserOutlined } from '@ant-design/icons';
import { Avatar, Flex } from 'antd';

export const Info = ({ fname, mail }) => {
    return (
        <Flex justify="center" align="center" gap={20}>
            <Avatar icon={<UserOutlined />} />
            <Flex vertical>
                <strong style={{ color: 'blueviolet', fontSize: '1.2rem' }}>
                    {fname}
                </strong>
                <span>{mail}</span>
            </Flex>
        </Flex>
    );
};
