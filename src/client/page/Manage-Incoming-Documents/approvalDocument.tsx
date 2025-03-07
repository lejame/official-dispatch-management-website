import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, message, Tag, Badge } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

interface DecodedToken {
    userId: string;
    exp: number;
    iat: number;
}

interface Document {
    _id: string;
    title: string;
    type: string;
    userId: { _id: string; fullname: string };
    categoryId: string;
    symbol: string;
    issueDate: Date;
    status: string;
    sender: string;
    notes?: string;
}

const IncomingDocumentApproval: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState<boolean>(false);

    // Lấy và giải mã jwtToken
    const getLoggedInUserId = (): string | null => {
        const token = localStorage.getItem('jwtToken');
        console.log('Token:', token);
        if (!token) {
            toast.error('Không tìm thấy JWT token!');
            return null;
        }

        try {
            const decodedToken: DecodedToken = jwtDecode(token);
            return decodedToken.id;
        } catch (error) {
            toast.error('Lỗi giải mã JWT token!');
            return null;
        }
    };

    const loggedInUserId = getLoggedInUserId(); // Gọi hàm lấy userId

    useEffect(() => {
        if (loggedInUserId) {
            fetchDocuments();
        }
    }, [loggedInUserId]);

    const fetchDocuments = async () => {
        try {
            const response = await axiosInstance.get('/document/incoming');
            const filteredDocs = response.data.data
                .filter((doc: Document) => doc.type === 'incoming' && doc.userId._id === loggedInUserId)
                .reverse(); // Đảo ngược mảng

            setDocuments(filteredDocs);
        } catch (error) {
            toast.error('Lấy danh sách công văn thất bại!');
        }
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
            const response = await axiosInstance.post(`/document/incoming/update-status`, {
                id: selectedDocument._id,
                status
            });

            if (response.status === 200) {
                const successMessage =
                    status === 'approved' ? 'Công văn đã được duyệt thành công!' : 'Công văn đã bị từ chối!';
                toast.success(successMessage);

                setDocuments((prevDocs) =>
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
            render: (text: string) => (
                <span
                    style={{
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        backgroundColor: '#fff3cd',
                        padding: '5px 8px',
                        borderRadius: '5px',
                        display: 'inline-block'
                    }}
                >
                    {text}
                </span>
            )
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
            title: 'Người gửi',
            dataIndex: 'sender',
            key: 'sender'
        },
        {
            title: 'Tổ chức gửi',
            dataIndex: 'organization',
            key: 'organization',
            render: (organization: string) => organization || 'Không có thông tin'
        },
        {
            title: 'Ngày nhận',
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
                    pending: { text: 'Chờ xử lý', color: 'red' }, // Màu đỏ nhạt
                    handled: { text: 'Đã xử lý', color: 'orange' }, // Màu cam nhạt
                    rejected: { text: 'Đã từ chối', color: 'volcano' }, // Màu đỏ đậm
                    approved: { text: 'Đã duyệt', color: 'green' } // Màu xanh lá cây nhạt
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
                title="Danh Sách Công Văn Cần Duyệt"
                style={{
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Table dataSource={documents} columns={columns} rowKey="_id" />
            </Card>

            {/* Modal xác nhận duyệt */}
            <Modal
                title="Xác nhận duyệt công văn"
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

            {/* Modal xác nhận từ chối */}
            <Modal
                title="Xác nhận từ chối công văn"
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

export default IncomingDocumentApproval;
