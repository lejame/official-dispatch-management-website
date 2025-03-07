import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, Select, DatePicker, Typography, Space, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from '../../service/Axios';

const { Content } = Layout;
const { Option } = Select;

const AddUser: React.FC = () => {
    const [departmentList, setDepartmentList] = useState<any[]>([]);
    const handleFinish = async (values: any) => {
        try {
            // Kiểm tra và xử lý định dạng đúng trước khi gửi
            const payload = {
                fullname: values.hovaten,
                username: values.tennv,
                email: values.email,
                password: values.password,
                phone: values.sdt,
                address: values.diachi,
                dateOfBirth: values.ngaysinh ? values.ngaysinh.format('YYYY-MM-DD') : undefined,
                dateOfJoin: values.ngayvaolam ? values.ngayvaolam.format('YYYY-MM-DD') : undefined,
                departmentId: values.DepartmentId,
                contractType: values.hopdong,
                role: values.vaitro
            };

            // Gọi API với payload đúng định dạng
            const response = await axiosInstance.post('/user/create', payload);

            message.success('Tạo người dùng thành công!');

            console.log('Response:', response.data);
        } catch (error) {
            message.error('Tạo người dùng thất bại!');
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/department');
            setDepartmentList(response.data.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <Layout className={'layout-container'}>
            <Layout>
                <Typography.Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
                    Thêm Thông Tin Nhân Viên
                </Typography.Title>
                <Content
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            padding: '30px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            width: '100%',
                            maxWidth: '800px'
                        }}
                    >
                        <Form
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            layout="horizontal"
                            style={{ marginTop: '20px' }}
                            onFinish={handleFinish}
                        >
                            {/* Các trường thông tin */}
                            <Form.Item
                                label="Họ và Tên"
                                name="hovaten"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên nhân viên!' }]}
                            >
                                <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} allowClear />
                            </Form.Item>
                            {/* Các trường thông tin */}
                            <Form.Item
                                label="Tên"
                                name="tennv"
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
                                <Input placeholder="Nhập email" prefix={<MailOutlined />} allowClear />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                            </Form.Item>

                            <Form.Item
                                label="Số Điện Thoại"
                                name="sdt"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} allowClear />
                            </Form.Item>

                            <Form.Item label="Địa chỉ" name="diachi">
                                <Input.TextArea placeholder="Nhập địa chỉ" rows={1} />
                            </Form.Item>

                            <Form.Item label="Ngày sinh" name="ngaysinh">
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item label="Ngày vào làm" name="ngayvaolam">
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item label="Hợp đồng" name="hopdong">
                                <Select placeholder="Chọn loại hợp đồng">
                                    <Option value="partime">Bán thời gian</Option>
                                    <Option value="fulltime">Toàn thời gian</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Phòng ban"
                                name="DepartmentId"
                                style={{ flex: '1 1 45%' }}
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban nhận!' }]}
                            >
                                <Select placeholder="Chọn phòng ban nhận">
                                    {departmentList &&
                                        departmentList.map((department) => (
                                            <Option key={department._id} value={department._id}>
                                                {department.name}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Vai trò" name="vaitro">
                                <Select placeholder="Chọn vai trò">
                                    <Option value="admin">Quản trị viên</Option>
                                    <Option value="user">Nhân viên</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Lưu Thông Tin
                                    </Button>
                                    <Button htmlType="reset">Hủy Bỏ</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AddUser;
