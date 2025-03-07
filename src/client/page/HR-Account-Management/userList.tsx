import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/layout/header/header'; // Header Component
import { Layout, Table, Input, Button, Avatar, Space, Switch, Card, Typography, Form, message } from 'antd';
import { SearchOutlined, InfoCircleOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios'; // Import axiosInstance

const { Content } = Layout;

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(true); // Trạng thái darkTheme của Sidebar
    const [collapsed, setCollapsed] = useState(false); // Trạng thái collapsed của Sidebar
    const [searchText, setSearchText] = useState<string>(''); // Tìm kiếm
    const [selectedUser, setSelectedUser] = useState<any>(null); // Lưu thông tin user đang chọn
    const [users, setUsers] = useState<any[]>([]); // Trạng thái lưu danh sách nhân viên
    const [userStatus, setUserStatus] = useState<Record<string, boolean>>({}); // Trạng thái tài khoản của từng user
    const [form] = Form.useForm(); // Form quản lý dữ liệu

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/user');
            console.log(response.data);
            const userList = response.data.filter((user: any) => user.role === 'user'); // Lọc danh sách nhân viên có vai trò là "user"
            setUsers(userList);
            const statusMap: Record<string, boolean> = {};
            userList.forEach((user: any) => {
                statusMap[user._id] = !user.isLocked;
            });
            setUserStatus(statusMap);
        } catch (error) {
            message.error('Lấy danh sách nhân viên thất bại!');
        }
    };

    const filteredUsers = users
        ? users.filter((user) => user.fullname?.toLowerCase().includes(searchText.toLowerCase()))
        : [];

    // Xử lý khi trạng thái tài khoản thay đổi
    const handleStatusChange = async (checked: boolean, userId: string) => {
        try {
            if (checked) {
                await axiosInstance.post('/user/unlock', { id: userId });
            } else {
                await axiosInstance.post('/user/lock', { id: userId });
            }
            setUserStatus((prevState) => ({
                ...prevState,
                [userId]: checked
            }));
            message.success(
                `Trạng thái tài khoản của người dùng ${
                    users.find((user) => user._id === userId)?.fullname
                } đã được cập nhật thành ${checked ? 'Hoạt động' : 'Khóa'}.`
            );
        } catch (error) {
            message.error('Cập nhật trạng thái tài khoản thất bại!');
        }
    };

    // Chuyển hướng đến trang /user-profile?_id=userid
    const handleViewProfile = (userId: string) => {
        navigate(`/user-profile?_id=${userId}`);
    };

    // Cột dữ liệu cho bảng
    const columns = [
        {
            title: 'Hình Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <Avatar src={text} size="large" />
        },
        {
            title: 'Tên Nhân Viên',
            dataIndex: 'fullname',
            key: 'fullname'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button icon={<InfoCircleOutlined />} onClick={() => handleViewProfile(record._id)}>
                        Xem Thông Tin
                    </Button>
                    <Button icon={<KeyOutlined />} onClick={() => setSelectedUser(record)}>
                        Tài Khoản
                    </Button>
                </Space>
            )
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (_: any, record: any) => (
                <Switch
                    checked={userStatus[record._id]}
                    onChange={(checked) => handleStatusChange(checked, record._id)}
                    checkedChildren="Hoạt Động"
                    unCheckedChildren="Khóa"
                />
            )
        }
    ];

    return (
        <Layout style={{ height: '100vh' }}>
            <Layout>
                <Content style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <Table columns={columns} dataSource={filteredUsers} rowKey="_id" pagination={{ pageSize: 5 }} />

                    {/* Form chỉnh sửa trạng thái tài khoản */}
                    {selectedUser && (
                        <Card
                            style={{
                                marginTop: 24
                            }}
                            title={`Chỉnh Sửa Tài Khoản: ${selectedUser.fullname}`}
                        >
                            <Typography.Paragraph>
                                <strong>Email:</strong> {selectedUser.email}
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <strong>Trạng Thái Tài Khoản:</strong>{' '}
                                <Switch
                                    checked={userStatus[selectedUser._id]}
                                    onChange={(checked) => handleStatusChange(checked, selectedUser._id)}
                                    checkedChildren="Hoạt Động"
                                    unCheckedChildren="Khóa"
                                />
                            </Typography.Paragraph>
                            <Button type="default" onClick={() => setSelectedUser(null)} style={{ marginTop: 16 }}>
                                Đóng
                            </Button>
                        </Card>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserList;
