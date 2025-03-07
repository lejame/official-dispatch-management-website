import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './sidenav.module.scss';
import { Logo } from './Logo';
import ToggleThemeButton from '../../common/toggle/toogleThemeButtom';
import MenuList from './menuList';

interface SideNavProps {
    collapsed: boolean;
    darkTheme: boolean;
    setDarkTheme: (value: boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ collapsed, darkTheme, setDarkTheme }) => {
    return (
        <Layout.Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            theme={darkTheme ? 'dark' : 'light'}
            className={styles.sidebar}
        >
            <Logo />
            <MenuList darkTheme={darkTheme} />
            <ToggleThemeButton darkTheme={darkTheme} toggleTheme={() => setDarkTheme(!darkTheme)} />
        </Layout.Sider>
    );
};

export default SideNav;
