import { Menu as AntdMenu } from 'antd';
import { menuItems } from './menuItems';

export const Menu = () => {
    return <AntdMenu items={menuItems} mode="inline" />;
};
