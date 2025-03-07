import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, AuditOutlined, FundOutlined, UserOutlined, ApartmentOutlined } from '@ant-design/icons';
import styles from './sidenav.module.scss';
import { jwtDecode } from 'jwt-decode';

interface MenuListProps {
    darkTheme: boolean;
}

const { SubMenu } = Menu;

const MenuList: React.FC<MenuListProps> = ({ darkTheme }) => {
    const token = localStorage.getItem('jwtToken');
    let isAdmin = false;

    if (token) {
        const decoded: any = jwtDecode(token);
        isAdmin = decoded.role === 'admin';
    }

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const handleOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode="inline"
            className={styles.menu_bar}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
        >
            <Menu.Item key="statistic-document-incoming" icon={<FundOutlined />}>
                <Link to="/statistic-document-incoming">Thống kê</Link>
            </Menu.Item>
            {isAdmin && (
                <SubMenu key="subtasks-staff" icon={<UserOutlined />} title="Tài khoản - Nhân sự">
                    <Menu.Item key="user-list">
                        <Link to="/user-list">Danh sách nhân sự</Link>
                    </Menu.Item>
                    <Menu.Item key="add-user">
                        <Link to="/add-user">Thêm nhân sự</Link>
                    </Menu.Item>
                </SubMenu>
            )}

            <SubMenu key="general-category" icon={<ApartmentOutlined />} title="Danh mục chung">
                <Menu.Item key="department">
                    <Link to="/department">Phòng Ban</Link>
                </Menu.Item>
                <Menu.Item key="document-types">
                    <Link to="/document-types">Loại công văn</Link>
                </Menu.Item>
                <Menu.Item key="document-fields">
                    <Link to="/document-fields">Lĩnh vực</Link>
                </Menu.Item>
            </SubMenu>

            <SubMenu key="subtasks-receive" icon={<AuditOutlined />} title="Công văn đến">
                <Menu.Item key="receive-document">
                    <Link to="/receive-document">Tiếp nhận công văn</Link>
                </Menu.Item>
                {isAdmin && (
                    <Menu.Item key="record-document">
                        <Link to="/record-document">Quản lý công văn đến</Link>
                    </Menu.Item>
                )}
                <Menu.Item key="approve-incoming-document">
                    <Link to="/approve-incoming-document">Duyệt công văn đến</Link>
                </Menu.Item>
            </SubMenu>

            <SubMenu key="subtasks-outgoing" icon={<AuditOutlined />} title="Công văn đi">
                <Menu.Item key="compose-outgoing-document">
                    <Link to="/add-outgoing-document">Soạn thảo công văn</Link>
                </Menu.Item>
                <Menu.Item key="outgoing-document-list">
                    <Link to="/outgoing-document-list">Danh sách công văn đi</Link>
                </Menu.Item>
                <Menu.Item key="approve-outgoing-document">
                    <Link to="/approve-outgoing-document">Duyệt công văn đi</Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default MenuList;
