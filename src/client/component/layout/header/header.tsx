import React, { useState, useEffect } from 'react';
import { Button, Layout, Avatar, Dropdown, Menu, Space, Badge, List, message } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    UserOutlined,
    BellOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import axiosInstance from '../../../service/Axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../../../../server/models/User';

interface DecodedToken {
    _id: string;
    [key: string]: any; // Để xử lý thêm các thông tin khác nếu có
}

const Header: React.FC<{ collapsed: boolean; setCollapsed: any }> = ({ collapsed, setCollapsed }) => {
    const [notifications, setNotifications] = useState<number>(0);
    const [noticeList, setNoticeList] = useState<any[]>([]);
    const [userInfo, setUserInfo] = useState<any>({});
    const navigate = useNavigate();

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                const decoded: any = jwtDecode(token);
                const userId = decoded.id;

                const response = await axiosInstance.post('/notification/get-account-notifications', { userId });
                const notices = response.data;

                console.log('Thông báo:', notices);

                setNoticeList(notices);
                const unreadNotices = notices.filter((notice: any) => !notice.isRead);
                setNotifications(unreadNotices.length);

                const responseUserInfo = await axiosInstance.post(`/user/get-user-by-id`, { id: userId });

                setUserInfo(responseUserInfo.data.data);
            }
        } catch (error) {
            console.error('Lấy thông báo thất bại:', error);
            setNotifications(0);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleMenuClick = (e: any) => {
        if (e.key === 'logout') {
            localStorage.removeItem('jwtToken');
            message.success('Đăng xuất thành công!');

            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } else if (e.key === 'profile' && userInfo) {
            navigate(`/user-profile`);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await axiosInstance.post('/notification/update-status', { notificationId });
            setNoticeList((prevNotices) =>
                prevNotices.map((notice) => (notice._id === notificationId ? { ...notice, read: true } : notice))
            );
            message.success('Đánh dấu thông báo đã đọc thành công!');
            fetchNotices();
        } catch (error) {
            message.error('Đánh dấu thông báo đã đọc thất bại!');
        }
    };

    const menuItems = [
        { label: 'Thông tin nhân viên', key: 'profile', icon: <UserOutlined /> },
        { label: 'Đăng xuất', key: 'logout', icon: <LogoutOutlined /> }
    ];

    const noticeMenuItems =
        noticeList.length > 0
            ? noticeList
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) => ({
                      key: item._id,
                      label: (
                          <div
                              style={{
                                  maxHeight: '50vh',
                                  backgroundColor: item.isRead ? '#f0f0f0' : '#fff',
                                  padding: '8px'
                              }}
                          >
                              <div style={{ fontWeight: 'bold' }}>{item.title || 'Thông báo'}</div>
                              <div>{item.message}</div>
                              <div style={{ fontSize: '12px', color: '#888' }}>
                                  {new Date(item.createdAt).toLocaleString()}
                              </div>
                              {!item.isRead && (
                                  <Button type="link" onClick={() => handleMarkAsRead(item._id)}>
                                      Đánh dấu đã đọc
                                  </Button>
                              )}
                          </div>
                      )
                  }))
            : [{ key: 'no-notifications', label: 'Không có thông báo', disabled: true }];

    return (
        <Layout.Header
            style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            <Button
                type="text"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Space style={{ marginRight: '16px' }}>
                <Button type="text" icon={<ReloadOutlined />} onClick={fetchNotices} />
                <Dropdown menu={{ items: noticeMenuItems }} trigger={['click']}>
                    <Badge count={notifications} overflowCount={99}>
                        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                    </Badge>
                </Dropdown>
                <Dropdown overlay={<Menu items={menuItems} onClick={handleMenuClick} />} trigger={['click']}>
                    <Avatar style={{ cursor: 'pointer' }} src={userInfo.avatar || DEFAULT_AVATAR} />
                </Dropdown>
            </Space>
        </Layout.Header>
    );
};

export default Header;
