import { Avatar, Dropdown, Flex } from 'antd';
import { createUserMenu } from './createUserMenu';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import './user.css';
import { useMemo } from 'react';

export const User = ({ userInfo }) => {
    const userMenu = useMemo(() => {
        return createUserMenu(userInfo);
    }, [userInfo]);

    return (
        <Dropdown
            className="admin-header-user-menu"
            rootClassName="admin-header-user-menu-submenu"
            menu={{ items: userMenu }}
            trigger={'click'}
        >
            <Flex justify="center" align="center" gap={20}>
                <Avatar icon={<UserOutlined />} />
                <DownOutlined />
            </Flex>
        </Dropdown>
    );
};
