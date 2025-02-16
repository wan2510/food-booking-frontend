import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Info } from './Info';

export const createUserMenu = (userInfo) => [
    {
        key: 'info',
        label: <Info fname={userInfo.fname} mail={userInfo.mail} />,
        disabled: true,
    },
    {
        type: 'divider',
    },
    {
        key: 'profile',
        label: <Link to={'#'}>Trang cá nhân</Link>,
        icon: <ProfileOutlined />,
    },
    {
        key: 'logout',
        label: <Link to={'#'}>Đăng xuất</Link>,
        icon: <LogoutOutlined />,
    },
];
