import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Card, Badge } from 'antd';
import axiosInstance from '../../service/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const { Option } = Select;

interface Document {
    id: string;
    title: string;
    type: string;
    userId: string;
    categoryId: string;
    departmentId: string;
    fieldId: string;
    receivingDepartmentId: string;
    symbol: string;
    issueDate: Date;
    expirationDate: Date;
    recipient: string;
    sender: string;
    pageCount: number;
    documentNumber: number;
    status: string;
    attachmentUrl?: string;
    organization?: string;
    notes?: string;
}

const DocumentRecording: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [form] = Form.useForm();
    const [users, setUsers] = useState<unknown[]>([]);

    useEffect(() => {
        fetchDocuments();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/user');
            if (!response.data) {
                toast.error('Không có nhân viên nào!');
            }
            setUsers(response.data);
        } catch {
            toast.error('Lấy danh sách nhân viên thất bại!');
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await axiosInstance.get('/document/incoming');
            console.log(response.data.data);
            setDocuments(
                response.data.data
                    .filter((doc: Document) => doc.type === 'incoming' && doc.status === 'handled')
                    .reverse()
            );
        } catch {
            toast.error('Lấy danh sách công văn thất bại!');
        }
    };

    const openModal = (record: Document) => {
        setSelectedDocument(record);
        form.setFieldsValue({ ...record, userId: record.userId._id });
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedDocument(null);
        form.resetFields();
    };

    const handleUpdateDocument = async (values: Record<string, any>) => {
        if (!selectedDocument?._id) {
            toast.error('Không thể xác định công văn để cập nhật!');
            return;
        }

        const payload = {
            id: selectedDocument._id,
            ...values
        };

        try {
            console.log('Updating document with payload:', payload);

            const response = await axiosInstance.post(`/document/incoming/update`, payload);
            console.log('Update document response:', response.data);

            await axiosInstance.post('/notification/create', {
                userId: values.userId,
                documentId: selectedDocument._id,
                message: `Bạn đã được gán xử lý công văn: ${selectedDocument.title}`
            });

            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) => (doc._id === selectedDocument._id ? { ...doc, ...values } : doc))
            );

            toast.success('Cập nhật công văn thành công!');
            closeModal();
            fetchDocuments();
        } catch (error: any) {
            console.error('Error updating document:', error);
            const errorMessage = error.response?.data?.message || 'Cập nhật công văn thất bại!';
            toast.error(errorMessage);
        }
    };

    const showConfirmModal = () => {
        setIsConfirmModalVisible(true);
    };

    const handleConfirm = () => {
        form.validateFields()
            .then((values) => {
                handleUpdateDocument(values);
                setIsConfirmModalVisible(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancelConfirm = () => {
        setIsConfirmModalVisible(false);
    };
    const showDeleteConfirmModal = (record: Document) => {
        setSelectedDocument(record);
        setIsDeleteConfirmModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedDocument) {
            try {
                await axiosInstance.post(`/document/incoming/delete`, { id: selectedDocument._id });
                setDocuments(documents.filter((doc) => doc._id !== selectedDocument._id));
                toast.success('Xóa công văn thành công!');
                setIsDeleteConfirmModalVisible(false);
                setSelectedDocument(null);
            } catch {
                toast.error('Xóa công văn thất bại!');
            }
        } else {
            toast.error('Không thể xác định công văn để xóa!');
        }
    };

    const handleCancelDeleteConfirm = () => {
        setIsDeleteConfirmModalVisible(false);
        setSelectedDocument(null);
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
            title: 'Người gửi',
            dataIndex: 'sender',
            key: 'sender'
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
                const statusMap: Record<string, string> = {
                    pending: 'Chờ xử lý',
                    handled: 'Đã được tiếp nhận'
                };
                return statusMap[status];
            }
        },
        {
            title: 'Nhân viên xử lý',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId: string) => {
                return documents.find((doc) => doc.userId === userId)?.userId.fullname;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: Document) => (
                <div>
                    <Button type="link" onClick={() => openModal(record)}>
                        Cập nhật
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteConfirmModal(record)}>
                        Xóa
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            {/* Danh sách công văn */}
            <Card
                title="Danh Sách Công Văn Đã Tiếp Nhận"
                style={{
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Table dataSource={documents} columns={columns} rowKey="id" />
            </Card>
            <Modal title="Ghi Nhận Công Văn" visible={isModalVisible} onCancel={closeModal} footer={null}>
                {selectedDocument && (
                    <Form form={form} onFinish={showConfirmModal} layout="vertical">
                        <Form.Item label="Mã công văn" name="symbol">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Tiêu đề công văn" name="title">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Người gửi" name="sender">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tình trạng"
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                        >
                            <Select placeholder="Chọn tình trạng công văn">
                                <Option value="pending">Chờ xử lý</Option>
                                <Option value="handled">Đã được tiếp nhận</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Nhân viên xử lý"
                            name="userId"
                            style={{ flex: '1 1 45%' }}
                            rules={[{ required: true, message: 'Vui lòng chọn nhân viên xử lý!' }]}
                        >
                            <Select placeholder="Chọn nhân viên xử lý" defaultValue={selectedDocument.userId}>
                                {users &&
                                    users.map((user) => (
                                        <Option key={user._id} value={user._id}>
                                            {user.fullname}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Ghi chú" name="notes">
                            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Cập nhật công văn
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            {/* Modal xác nhận */}
            <Modal
                title="Xác nhận"
                visible={isConfirmModalVisible}
                onOk={handleConfirm}
                onCancel={handleCancelConfirm}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn cập nhật thông tin công văn này không?</p>
            </Modal>
            {/* Modal xác nhận xóa */}
            <Modal
                title="Xác nhận xóa"
                visible={isDeleteConfirmModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={handleCancelDeleteConfirm}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa công văn này không?</p>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default DocumentRecording;
