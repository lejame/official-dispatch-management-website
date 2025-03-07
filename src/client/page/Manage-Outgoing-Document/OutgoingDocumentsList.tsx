import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Typography, Modal, message, Select, AutoComplete, Tag, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const OutgoingDocumentsList: React.FC = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [filterText, setFilterText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<{ value: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axiosInstance.get('/document/outgoing');
            const sortedDocs = response.data.data
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .reverse(); // Đảo ngược danh sách sau khi sắp xếp
            setDocuments(sortedDocs);
            setAutoCompleteOptions(sortedDocs.map((doc: any) => ({ value: doc.symbol })));
        } catch {
            message.error('Không thể lấy danh sách công văn!');
        }
    };

    const handleDelete = async (record: any) => {
        try {
            await axiosInstance.post('/document/outgoing/delete', { id: record._id });
            setDocuments(documents.filter((doc: any) => doc._id !== record._id));
            message.success('Xóa công văn thành công!');
        } catch {
            message.error('Xóa công văn thất bại!');
        }
    };

    const showDeleteConfirm = (record: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa công văn này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(record)
        });
    };

    const handleEdit = (record: any) => {
        navigate(`/update-outgoing-document?id=${record._id}`);
    };

    const filteredDocuments = documents.filter((doc: any) => {
        const matchesSymbol = doc.symbol.toLowerCase().includes(filterText.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'approved' && doc.status === 'approved') ||
            (statusFilter === 'pending' && doc.status === 'pending');
        return matchesSymbol && matchesStatus;
    });

    const columns = [
        {
            title: 'Tên công văn',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Loại công văn',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId: any) => categoryId?.name || ''
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'fieldId',
            key: 'fieldId',
            render: (fieldId: any) => fieldId?.name || ''
        },
        {
            title: 'Số hiệu',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol: string, record: any, index: number) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                        style={{
                            backgroundColor: '#fff3cd',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            textDecoration: 'underline',
                            display: 'inline-block'
                        }}
                    >
                        {symbol}
                    </span>
                    {index === 0 && ( // Hiển thị "Mới nhất" khi ở đầu danh sách
                        <Badge
                            count="Mới nhất"
                            style={{
                                backgroundColor: '#52c41a',
                                color: '#fff',
                                marginLeft: '8px',
                                fontSize: '12px'
                            }}
                        />
                    )}
                </div>
            )
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'approved' ? 'green' : 'red'}>
                    {status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        style={{ backgroundColor: '#e0f7fa', color: '#00796b', border: 'none' }}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{ backgroundColor: '#ffebee', color: '#b71c1c', border: 'none' }}
                        onClick={() => showDeleteConfirm(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div
                style={{
                    background: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Danh sách công văn đã soạn thảo
                </Title>

                <Space style={{ marginBottom: '20px', width: '100%', justifyContent: 'space-between' }}>
                    <AutoComplete
                        options={autoCompleteOptions}
                        style={{ width: '300px' }}
                        onChange={setFilterText}
                        placeholder="Tìm theo số hiệu công văn"
                    >
                        <Input prefix={<FilterOutlined />} />
                    </AutoComplete>

                    <Select defaultValue="all" style={{ width: '200px' }} onChange={(value) => setStatusFilter(value)}>
                        <Option value="all">Tất cả</Option>
                        <Option value="approved">Đã duyệt</Option>
                        <Option value="handled">Chưa duyệt</Option>
                    </Select>
                </Space>

                <Table
                    dataSource={filteredDocuments}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    style={{ background: '#fff' }}
                />
            </div>
        </div>
    );
};

export default OutgoingDocumentsList;
