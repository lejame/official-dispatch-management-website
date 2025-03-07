import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Tag, Input, Badge } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

const { Search } = Input;

interface Document {
    _id: string;
    title: string;
    type: string;
    userId: { _id: string; fullname: string };
    categoryId: string;
    symbol: string;
    issueDate: Date;
    status: string;
    recipient: string;
    notes?: string;
}

const OutgoingDocumentApproval: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState<boolean>(false);

    // Lấy id người dùng từ token JWT
    const getLoggedInUserId = (): string | null => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.id; // Giả sử id của người dùng được lưu trong decoded.id
            } catch (error) {
                toast.error('Lỗi khi giải mã token!');
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        fetchOutgoingDocuments();
    }, []);

    const fetchOutgoingDocuments = async () => {
        const loggedInUserId = getLoggedInUserId();
        if (!loggedInUserId) {
            toast.error('Không tìm thấy thông tin người dùng!');
            return;
        }

        try {
            const response = await axiosInstance.get('/document/outgoing');
            // Lọc các công văn đi mà userId._id trùng với id người dùng hiện tại
            const filteredDocs = response.data.data
                .filter((doc: Document) => doc.userId._id === loggedInUserId)
                .reverse(); // Đảo ngược công văn (công văn cuối lên đầu)

            setDocuments(filteredDocs);
            setFilteredDocuments(filteredDocs); // Áp dụng danh sách ban đầu cho bộ lọc
        } catch (error) {
            toast.error('Lấy danh sách công văn đi thất bại!');
        }
    };

    const handleSearch = (value: string) => {
        const filtered = documents.filter((doc) => doc.title.toLowerCase().includes(value.toLowerCase()));
        setFilteredDocuments(filtered);
    };

    const showConfirmModal = (record: Document) => {
        setSelectedDocument(record);
        setIsConfirmModalVisible(true);
    };

    const showRejectModal = (record: Document) => {
        setSelectedDocument(record);
        setIsRejectModalVisible(true);
    };

    const handleDocumentStatusChange = async (status: string) => {
        if (!selectedDocument) {
            toast.error('Không xác định được công văn!');
            return;
        }

        try {
            const response = await axiosInstance.post(`/document/outgoing/update-status`, {
                id: selectedDocument._id,
                status
            });

            if (response.status === 200) {
                const successMessage =
                    status === 'approved' ? 'Công văn đi đã được duyệt thành công!' : 'Công văn đi đã bị từ chối!';
                toast.success(successMessage);

                setDocuments((prevDocs) =>
                    prevDocs.map((doc) => (doc._id === selectedDocument._id ? { ...doc, status } : doc))
                );
                setFilteredDocuments((prevDocs) =>
                    prevDocs.map((doc) => (doc._id === selectedDocument._id ? { ...doc, status } : doc))
                );

                setSelectedDocument(null);
                setIsConfirmModalVisible(false);
                setIsRejectModalVisible(false);
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái công văn thất bại!');
        }
    };

    const handleConfirmApproval = async () => {
        await handleDocumentStatusChange('approved');
    };

    const handleRejectDocument = async () => {
        await handleDocumentStatusChange('rejected');
    };

    const columns = [
        {
            title: 'Mã công văn',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string) => <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{text}</span>
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
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'issueDate',
            key: 'issueDate',
            render: (text: string) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusMap: Record<string, { text: string; color: string }> = {
                    pending: { text: 'Chờ xử lý', color: 'red' },
                    handled: { text: 'Đã xử lý', color: 'orange' },
                    rejected: { text: 'Đã từ chối', color: 'volcano' },
                    approved: { text: 'Đã duyệt', color: 'green' }
                };
                const statusObj = statusMap[status] || { text: 'Không xác định', color: 'default' };
                return <Tag color={statusObj.color}>{statusObj.text}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: Document) => (
                <>
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => showConfirmModal(record)}
                        disabled={record.status === 'approved'}
                        style={{
                            backgroundColor: record.status === 'approved' ? '#52c41a' : '#1890ff',
                            borderColor: record.status === 'approved' ? '#52c41a' : '#1890ff',
                            marginRight: '10px'
                        }}
                    >
                        {record.status === 'approved' ? 'Đã duyệt' : 'Duyệt'}
                    </Button>
                    <Button
                        type="default"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => showRejectModal(record)}
                        disabled={record.status === 'rejected'}
                    >
                        {record.status === 'rejected' ? 'Đã từ chối' : 'Từ chối'}
                    </Button>
                </>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title="Danh Sách Công Văn Đi"
                extra={
                    <Search
                        placeholder="Tìm kiếm theo tiêu đề"
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        enterButton={<SearchOutlined />}
                    />
                }
                style={{ borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
            >
                <Table dataSource={filteredDocuments} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />
            </Card>

            <Modal
                title="Xác nhận duyệt công văn đi"
                visible={isConfirmModalVisible}
                onOk={handleConfirmApproval}
                onCancel={() => setIsConfirmModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn duyệt công văn này?</p>
                {selectedDocument && (
                    <p>
                        <strong>Mã công văn:</strong> {selectedDocument.symbol} <br />
                        <strong>Tiêu đề:</strong> {selectedDocument.title}
                    </p>
                )}
            </Modal>

            <Modal
                title="Xác nhận từ chối công văn đi"
                visible={isRejectModalVisible}
                onOk={handleRejectDocument}
                onCancel={() => setIsRejectModalVisible(false)}
                okText="Từ chối"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn từ chối công văn này?</p>
                {selectedDocument && (
                    <p>
                        <strong>Mã công văn:</strong> {selectedDocument.symbol} <br />
                        <strong>Tiêu đề:</strong> {selectedDocument.title}
                    </p>
                )}
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default OutgoingDocumentApproval;
