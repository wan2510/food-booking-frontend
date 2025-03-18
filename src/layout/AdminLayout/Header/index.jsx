import { Flex, Layout } from 'antd';
import { Logo } from './Logo';
import { Notification } from './Notification';
import { User } from './User';
import './header.css';

const userInfo = {
    fname: 'Nguyen Van A',
    mail: 'nguyenvana@gmail.com',
};

export const Header = () => {
    return (
        <Layout.Header className="admin-header">
            <Flex
                style={{
                    height: 75,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2) !important',
                }}
                justify="space-between"
                align="center"
            >
                <Logo />
                <Flex align="center" gap={20}>
                    <Notification />
                    <User userInfo={userInfo} />
                </Flex>
            </Flex>
        </Layout.Header>
    );
};
export default Header;
