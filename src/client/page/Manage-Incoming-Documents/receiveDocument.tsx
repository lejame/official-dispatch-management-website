import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Input, Select, Modal, Descriptions, Tag, Card, message, Badge } from 'antd';
import axiosInstance from '../../service/Axios';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const { Content } = Layout;
const { Option } = Select;

interface Document {
    id: string;
    title: string;
    type: string;
    symbol: string;
    sender: string;
    organization: string;
    status: string;
    categoryId: {
        _id: string;
        name: string;
    };
    fieldId: {
        _id: string;
        name: string;
    };
    attachmentUrl?: string;
    attachmentName?: string;
}

const ReceiveDocument: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [documentToRecord, setDocumentToRecord] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('');
    const [documentTypes, setDocumentTypes] = useState<any[]>([]);
    const [documentFields, setDocumentFields] = useState<any[]>([]);

    const token = localStorage.getItem('jwtToken');
    let isAdmin = false;
    if (token) {
        const decoded: any = jwtDecode(token);
        isAdmin = decoded.role === 'admin';
    }

    useEffect(() => {
        fetchDocuments();
        fetchDocumentTypes();
        fetchDocumentFields();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [searchText]);

    const fetchDocuments = async () => {
        try {
            const response = await axiosInstance.get('/document/incoming');
            const filteredDocuments = response.data.data
                .filter((doc: Document) => {
                    const matchesTitle = doc.title.toLowerCase().includes(searchText.toLowerCase());
                    const matchesType = searchType ? doc.categoryId._id === searchType : true;
                    const matchesField = searchField ? doc.fieldId._id === searchField : true;
                    return matchesTitle && matchesType && matchesField;
                })
                .reverse();
            setDocuments(filteredDocuments);
        } catch {
            toast.error('Lấy danh sách công văn thất bại!');
        }
    };

    const fetchDocumentTypes = async () => {
        try {
            const response = await axiosInstance.get('/document/category');
            setDocumentTypes(response.data.data);
        } catch {
            toast.error('Lấy danh sách loại công văn thất bại!');
        }
    };

    const fetchDocumentFields = async () => {
        try {
            const response = await axiosInstance.get('/document/field');
            setDocumentFields(response.data.data);
        } catch {
            toast.error('Lấy danh sách lĩnh vực thất bại!');
        }
    };

    const handleSearch = () => {
        fetchDocuments();
    };

    const handleReset = () => {
        setSearchText('');
        setSearchType('');
        setSearchField('');
        fetchDocuments();
    };

    const handleMarkAsRecorded = async (id: string) => {
        try {
            await axiosInstance.post('/document/incoming/update-status', { id });
            toast.success('Công văn đã được tiếp nhận thành công!');
            fetchDocuments(); // Gọi lại hàm fetchDocuments để cập nhật danh sách
        } catch {
            toast.error('Tiếp nhận công văn thất bại!');
        }
    };

    const openModal = (record: Document) => {
        setSelectedDocument(record);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedDocument(null);
    };

    const showConfirmModal = (id: string) => {
        setDocumentToRecord(id);
        setIsConfirmModalVisible(true);
    };

    const handleConfirm = () => {
        if (documentToRecord) {
            handleMarkAsRecorded(documentToRecord);
        }
        setIsConfirmModalVisible(false);
        setDocumentToRecord(null);
    };

    const handleCancel = () => {
        setIsConfirmModalVisible(false);
        setDocumentToRecord(null);
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title'
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
            title: 'Loại công văn',
            dataIndex: ['categoryId', 'name'],
            key: 'categoryId'
        },
        {
            title: 'Lĩnh vực',
            dataIndex: ['fieldId', 'name'],
            key: 'fieldId'
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'pending' | 'recorded') => (
                <Tag color={status === 'pending' ? 'red' : 'green'}>
                    {status === 'pending' ? 'Chưa kiểm duyệt' : 'Đã tiếp nhận'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: Document) => (
                <div>
                    <Button type="link" onClick={() => openModal(record)}>
                        Xem chi tiết
                    </Button>
                    {isAdmin && record.status === 'pending' && (
                        <Button type="link" onClick={() => showConfirmModal(record._id)}>
                            Tiếp nhận
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title="Tiếp Nhận Công Văn"
                extra={
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Input
                            placeholder="Tìm kiếm tên công văn"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <Select
                            placeholder="Loại công văn"
                            value={searchType ? searchType : 'Loại công văn'}
                            onChange={(value) => setSearchType(value)}
                            style={{ width: 200 }}
                        >
                            {documentTypes.map((type) => (
                                <Option key={type._id} value={type._id}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Loại lĩnh vực"
                            value={searchField ? searchField : 'Loại lĩnh vực'}
                            onChange={(value) => setSearchField(value)}
                            style={{ width: 200 }}
                        >
                            {documentFields.map((field) => (
                                <Option key={field._id} value={field._id}>
                                    {field.name}
                                </Option>
                            ))}
                        </Select>
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                            Tìm kiếm
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Đặt lại
                        </Button>
                    </div>
                }
                style={{
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Table dataSource={documents} columns={columns} rowKey="id" />
            </Card>

            {/* Modal xem chi tiết công văn */}
            <Modal title="Chi Tiết Công Văn" visible={isModalVisible} onCancel={closeModal} footer={null}>
                {selectedDocument && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Tiêu đề">{selectedDocument.title}</Descriptions.Item>
                        <Descriptions.Item label="Tổ chức gửi">{selectedDocument.organization}</Descriptions.Item>
                        <Descriptions.Item label="Người gửi">{selectedDocument.sender}</Descriptions.Item>
                        <Descriptions.Item label="Loại công văn">{selectedDocument.categoryId.name}</Descriptions.Item>
                        <Descriptions.Item label="Loại lĩnh vực">{selectedDocument.fieldId.name}</Descriptions.Item>
                        <Descriptions.Item label="Số ký hiệu">{selectedDocument.symbol}</Descriptions.Item>

                        <Descriptions.Item label="Tệp đính kèm">
                            <a href={selectedDocument.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                {selectedDocument.attachmentName}
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={selectedDocument.status === 'pending' ? 'red' : 'green'}>
                                {selectedDocument.status === 'pending' ? 'Chưa kiểm duyệt' : 'Đã tiếp nhận'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Modal xác nhận tiếp nhận công văn */}
            <Modal
                title="Xác nhận"
                visible={isConfirmModalVisible}
                onOk={handleConfirm}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn tiếp nhận công văn này không?</p>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default ReceiveDocument;
