import { Menu as AntdMenu } from 'antd';
import { menuItems } from './menuItems';
import React from "react";

export const Menu = () => {
    return <AntdMenu items={menuItems} mode="inline" />;
};
