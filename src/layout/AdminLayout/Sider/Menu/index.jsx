import { Menu as AntdMenu } from "antd";
import { menuItems } from "./menuItems";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
    const navigate = useNavigate(); 

    return (
        <AntdMenu
            mode="inline"
            items={menuItems}
            onClick={({ key }) => navigate(key)} 
        />
    );
};
