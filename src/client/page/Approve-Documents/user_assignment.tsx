import React, { useState, useEffect } from 'react';
import { Layout, Select, Table, Button, Space, Typography, Card, message } from 'antd';
import axiosInstance from '../../service/Axios';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

interface Employee {
    id: number;
    name: string;
    position: string;
    phone: string;
}

interface Department {
    _id: number;
    name: string;
}

const EmplyeeeApproval: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(1); // Giá trị mặc định là phòng ban 1
    const [completedActions, setCompletedActions] = useState<{ [key: number]: Set<string> }>({});
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [selectedDepartment]);

    const fetchDepartments = async () => {
        try {
            const response = await axiosInstance.get('/department');
            setDepartments(response.data.data);
        } catch (error) {
            message.error('Lấy danh sách phòng ban thất bại!');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get(`/api/employees?departmentId=${selectedDepartment}`);
            setEmployees(response.data.data);
        } catch (error) {
            message.error('Lấy danh sách nhân viên thất bại!');
        }
    };

    const handleDepartmentChange = (value: number) => {
        setSelectedDepartment(value);
    };

    const handleActionToggle = async (action: string, employeeId: number, employeeName: string) => {
        try {
            const response = await axiosInstance.post('/api/assign-reviewer', {
                employeeId,
                action
            });

            if (response.status === 200) {
                setCompletedActions((prev) => {
                    const updated = { ...prev };
                    if (!updated[employeeId]) {
                        updated[employeeId] = new Set();
                    }
                    if (updated[employeeId].has(action)) {
                        updated[employeeId].delete(action);
                        message.info(`Quyền "${action}" đã được hủy cho người dùng: ${employeeName}`);
                    } else {
                        updated[employeeId].add(action);
                        message.success(`Quyền "${action}" đã được cấp cho người dùng: ${employeeName}`);
                    }
                    return updated;
                });
            } else {
                message.error('Phân quyền thất bại!');
            }
        } catch (error) {
            message.error('Phân quyền thất bại!');
        }
    };

    const columns = [
        {
            title: 'Tên Nhân Viên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Chức Vụ',
            dataIndex: 'position',
            key: 'position'
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Hành Động',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space>
                    <Button
                        style={getButtonStyle(
                            'Duyệt công văn đến',
                            completedActions[record.id]?.has('Duyệt công văn đến') || false
                        )}
                        onClick={() => handleActionToggle('Duyệt công văn đến', record.id, record.name)}
                    >
                        Duyệt Công Văn Đến
                    </Button>
                    <Button
                        style={getButtonStyle(
                            'Duyệt công văn đi',
                            completedActions[record.id]?.has('Duyệt công văn đi') || false
                        )}
                        onClick={() => handleActionToggle('Duyệt công văn đi', record.id, record.name)}
                    >
                        Duyệt Công Văn Đi
                    </Button>
                </Space>
            )
        }
    ];

    const getButtonStyle = (action: string, completed: boolean) => {
        if (completed) {
            return { backgroundColor: 'green', color: 'white' }; // Màu xanh lá khi hoàn thành
        }
        switch (action) {
            case 'Duyệt công văn đến':
                return { backgroundColor: '#1890ff', color: 'white' }; // Màu xanh nước biển
            case 'Duyệt công văn đi':
                return { backgroundColor: '#faad14', color: 'black' }; // Màu vàng
            default:
                return {};
        }
    };

    return (
        <Layout style={{ height: '100vh', padding: '24px' }}>
            <Content>
                <Card>
                    <Title level={4}>Danh Sách Nhân Viên</Title>
                    <Select
                        placeholder="Chọn Phòng Ban"
                        style={{ width: 300, marginBottom: '16px' }}
                        onChange={handleDepartmentChange}
                        value={selectedDepartment ? selectedDepartment : 'Chọn Phòng Ban'}
                    >
                        {departments.map((department) => (
                            <Option key={department._id} value={department._id}>
                                {department.name}
                            </Option>
                        ))}
                    </Select>
                    <Table columns={columns} dataSource={employees} rowKey="id" />
                </Card>
            </Content>
        </Layout>
    );
};

export default EmplyeeeApproval;
