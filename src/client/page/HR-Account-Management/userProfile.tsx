import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Form, Input, Button, Select, Upload, Avatar, message, Space, DatePicker } from 'antd';
import { MailOutlined, PhoneOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Content } = Layout;
const { Option } = Select;

const UserProfile: React.FC = () => {
    const location = useLocation();
    const [avatar, setAvatar] = useState<string>('src/client/assets/avata.jpg');
    const [avatarFile, setAvatarFile] = useState(null);
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [departmentList, setDepartmentList] = useState<any[]>([]);

    const getCurrentId = () => {
        const searchParams = new URLSearchParams(location.search);
        let userId = searchParams.get('_id');

        const token = localStorage.getItem('jwtToken');
        if (!token) return null;

        const decoded: any = jwtDecode(token);
        setIsAdmin(decoded.role === 'admin');

        if (userId) return userId;
        userId = decoded.id;

        if (!userId) return null;

        return userId;
    };

    useEffect(() => {
        const userId = getCurrentId();

        if (!userId) {
            setUser(null);
            return;
        }
        fetchDepartment();
        setUser(null);
        fetchUser(userId);
    }, [location.search]);

    const fetchDepartment = async () => {
        try {
            const response = await axiosInstance.get('/department');
            setDepartmentList(response.data.data);
        } catch (error) {
            message.error('Lấy danh sách phòng ban thất bại!');
        }
    };
    const fetchUser = async (userId: string) => {
        try {
            const response = await axiosInstance.post(`/user/get-user-by-id`, { id: userId });
            console.log(response.data.data);
            setUser(response.data.data);
            setAvatar(response.data.data.avatar || '');
        } catch (error) {
            message.error('Lấy thông tin người dùng thất bại!');
        }
    };

    const handleFormSubmit = async (values: any) => {
        const updateData = {
            _id: getCurrentId(),
            contractType: values.contract,
            departmentId: values.departmentId,
            dateOfBirth: dayjs(values.dob).tz('Asia/Ho_Chi_Minh').toISOString(),
            dateOfJoin: dayjs(values.startAt).tz('Asia/Ho_Chi_Minh').toISOString(),
            email: values.email,
            fullname: values.name,
            phone: values.phone,
            role: values.role,
            username: values.username,
            address: values.address,
            image: avatarFile,
            imageUrl: values.avatar
        };

        try {
            await axiosInstance.post('/user/update', updateData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            message.success('Cập nhật thông tin thành công!');
        } catch (error) {
            message.error('Cập nhật thông tin thất bại!');
        }
    };

    const handleChangeAvatar = async (data: any) => {
        setAvatarFile(data.file);
        const reader = new FileReader();

        reader.onload = (event) => {
            setAvatar(event.target?.result as string);
        };

        reader.readAsDataURL(data.file);
    };

    return (
        <Layout style={{ height: '100%' }}>
            <Layout>
                <Content
                    className="layout-content"
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            padding: '30px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            width: '100%',
                            maxWidth: '800px',
                            flex: 1
                        }}
                    >
                        {/* Nội dung form */}
                        {user && (
                            <Form
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                                style={{ marginTop: '20px' }}
                                onFinish={handleFormSubmit}
                                initialValues={{
                                    avatar: user.avatar,
                                    contract: user.contractType,
                                    departmentId: user.departmentId,
                                    dob: dayjs(user.dateOfBirth, 'YYYY-MM-DD'),
                                    startAt: dayjs(user.dateOfJoin, 'YYYY-MM-DD'),
                                    email: user.email,
                                    name: user.fullname,
                                    phone: user.phone,
                                    role: user.role,
                                    username: user.username,
                                    address: user.address
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <Avatar
                                        src={avatar}
                                        size={100}
                                        style={{ cursor: 'pointer', border: '2px solid #1890ff' }}
                                    />
                                    <div style={{ marginTop: '12px' }}>
                                        <Upload
                                            name="avatar"
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                const isImage = file.type.startsWith('image/');

                                                if (!isImage) {
                                                    message.error('Chỉ cho phép tải lên file ảnh.');
                                                    return Upload.LIST_IGNORE;
                                                }

                                                const isSmallEnough = file.size / 1024 / 1024 < 2;
                                                if (!isSmallEnough) {
                                                    message.error('Dung lượng ảnh phải nhỏ hơn 2MB.');
                                                    return Upload.LIST_IGNORE;
                                                }

                                                return false;
                                            }}
                                            onChange={handleChangeAvatar}
                                        >
                                            <Button icon={<UploadOutlined />}>Thay Đổi Ảnh Đại Diện</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <Form.Item
                                    label="Họ và Tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} allowClear />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập email"
                                        prefix={<MailOutlined />}
                                        allowClear
                                        disabled={!isAdmin}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Số Điện Thoại"
                                    name="phone"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: 'Số điện thoại không hợp lệ!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} allowClear />
                                </Form.Item>

                                <Form.Item label="Địa Chỉ" name="address">
                                    <Input.TextArea placeholder="Nhập địa chỉ nhân viên" rows={1} />
                                </Form.Item>
                                <Form.Item label="Ngày Sinh" name="dob">
                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="Ngày Vào Làm" name="startAt">
                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} disabled={!isAdmin} />
                                </Form.Item>
                                <Form.Item label="Hợp Đồng" name="contract">
                                    <Select placeholder="Chọn loại hợp đồng" disabled={!isAdmin}>
                                        <Option value="partime">Bán thời gian</Option>
                                        <Option value="fulltime">Toàn thời gian</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Phòng ban"
                                    name="departmentId"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban nhận!' }]}
                                >
                                    <Select placeholder="Chọn phòng ban nhận" disabled={!isAdmin}>
                                        {departmentList &&
                                            departmentList.map((department) => (
                                                <Option key={department._id} value={department._id}>
                                                    {department.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Vai Trò" name="role">
                                    <Select placeholder="Chọn vai trò" disabled={!isAdmin}>
                                        <Option value="user">Nhân Viên</Option>
                                        <Option value="admin">Quản Lý</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Lưu Thông Tin
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserProfile;
