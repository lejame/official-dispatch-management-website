import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axiosInstance from '../../service/Axios';
import { toast, ToastContainer } from 'react-toastify';

interface Department {
    _id: string;
    name: string;
}

const DepartmentPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const currentDepartmentRef = useRef<Department | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetchDepartments();
    }, [searchText]);

    const fetchDepartments = async () => {
        try {
            const response = await axiosInstance.get('/department');
            const filteredDepartments = response.data.data.filter((department: Department) =>
                department.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setDepartments(filteredDepartments);
        } catch (error) {
            toast.error('Lấy danh sách phòng ban thất bại!');
        }
    };

    const handleAddDepartment = async (values: { name: string }) => {
        try {
            const response = await axiosInstance.post('/department/create', values);
            setDepartments([...departments, response.data.data]);
            setIsAddModalVisible(false);
            form.resetFields();
            toast.success('Thêm phòng ban thành công!');
        } catch (error) {
            toast.error('Thêm phòng ban thất bại!');
        }
    };

    const handleEditDepartment = async (values: { name: string }) => {
        const currentDepartment = currentDepartmentRef.current;
        if (!currentDepartment) return;
        try {
            const response = await axiosInstance.post('/department/update', {
                id: currentDepartment._id,
                name: values.name
            });
            setDepartments(
                departments.map((department) =>
                    department._id === currentDepartment._id
                        ? { ...department, name: response.data.data.name }
                        : department
                )
            );
            setIsEditModalVisible(false);
            currentDepartmentRef.current = null;
            form.resetFields();
            toast.success('Cập nhật phòng ban thành công!');
        } catch (error) {
            toast.error('Cập nhật phòng ban thất bại!');
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        try {
            await axiosInstance.post('/department/delete', { id });
            setDepartments(departments.filter((department) => department._id !== id));
            toast.success('Xóa phòng ban thành công!');
            fetchDepartments();
        } catch (error) {
            toast.error('Xóa phòng ban thất bại!');
        }
    };

    const columns = [
        {
            title: 'Tên phòng ban',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Department) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => {
                            currentDepartmentRef.current = record;
                            form.setFieldsValue({ name: record.name });
                            setIsEditModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteDepartment(record._id)}>
                        Xóa
                    </Button>
                </span>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                    Thêm phòng ban
                </Button>
                <Input
                    placeholder="Tìm kiếm phòng ban"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>
            <Table dataSource={departments} columns={columns} rowKey="_id" />

            <Modal
                title="Thêm phòng ban"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddDepartment}>
                    <Form.Item
                        label="Tên phòng ban"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Sửa phòng ban"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleEditDepartment}>
                    <Form.Item
                        label="Tên phòng ban"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default DepartmentPage;
