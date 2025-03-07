import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Form, Upload, Typography, message, Layout, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;
const { Content } = Layout;

const AddOutgoingDocument: React.FC = () => {
    const [documents, setDocuments] = useState<unknown[]>([]);
    const [departments, setDepartments] = useState<unknown[]>([]);
    const [fields, setFields] = useState<unknown[]>([]);
    const [categories, setCategories] = useState<unknown[]>([]);

    const [users, setUsers] = useState<unknown[]>([]);
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
        fetchDepartments();
        fetchFields();
        fetchUsers();
        fetchCategory();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axiosInstance.get('/document/outgoing');
            setDocuments(response.data.data.filter((doc: any) => doc.status === 'pending'));
        } catch {
            toast.error('Lấy danh sách công văn thất bại!');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axiosInstance.get('/department');
            setDepartments(response.data.data);
        } catch {
            toast.error('Lấy danh sách phòng ban thất bại!');
        }
    };

    const fetchFields = async () => {
        try {
            const response = await axiosInstance.get('/document/field');
            setFields(response.data.data);
        } catch {
            toast.error('Lấy danh sách lĩnh vực thất bại!');
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.get('/document/category');
            setCategories(response.data.data);
            console.log(response.data.data);
        } catch {
            toast.error('Lấy danh loại công văn thất bại!');
        }
    };

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

    const handleFinish = async (values: any) => {
        const formData = new FormData();

        // Thêm tất cả các trường cần thiết vào formData
        formData.append('title', values.title);
        formData.append('type', 'outgoing'); // Hoặc lấy từ giao diện nếu cần
        formData.append('userId', values.reviewerId);
        formData.append('categoryId', values.categoryId);
        formData.append('departmentId', values.departmentId);
        formData.append('fieldId', values.fieldId);
        formData.append('receivingDepartmentId', values.receivingDepartmentId);
        formData.append('symbol', values.symbol);
        formData.append('issueDate', values.issueDate.format('YYYY-MM-DD'));
        formData.append('expirationDate', values.expirationDate.format('YYYY-MM-DD'));
        formData.append('recipient', values.recipient);
        formData.append('sender', values.sender);
        formData.append('pageCount', values.pageCount);
        formData.append('documentNumber', values.documentNumber);
        formData.append('organization', values.organization);
        formData.append('notes', values.notes || '');

        // Xử lý tệp đính kèm nếu có
        if (values.attachment && values.attachment.length > 0) {
            const file = values.attachment[0].originFileObj;
            formData.append('attachment', file);
        }

        try {
            const response = await axiosInstance.post('/document/outgoing/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            form.resetFields();
            message.success('Thêm công văn thành công!');
        } catch (error) {
            message.error('Thêm công văn thất bại!');
        }
    };

    const handleDelete = async (record: any) => {
        try {
            const response = await axiosInstance.post(
                '/document/outgoing/delete',
                { id: record._id },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200) {
                setDocuments(documents.filter((doc: any) => doc._id !== record._id));
                message.success('Xóa công văn thành công!');
            } else {
                message.error('Xóa công văn thất bại!');
            }
        } catch (error) {
            console.error(error);
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
            onOk() {
                handleDelete(record);
            }
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1
        },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Lĩnh vực',
            dataIndex: 'fieldId',
            key: 'fieldId.name',
            render: (fieldId: any) => fieldId?.name || ''
        },
        { title: 'Ký hiệu', dataIndex: 'symbol', key: 'symbol' },

        {
            title: 'Tệp đính kèm',
            dataIndex: 'attachmentUrl',
            key: 'attachmentUrl',
            render: (text: string, record: any) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {record.attachmentName}
                </a>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
                        Xóa
                    </Button>
                </>
            )
        }
    ];

    const handleEdit = (record: any) => {
        navigate(`/update-outgoing-document?id=${record._id}`);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Layout
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Content
                    style={{
                        padding: '20px',
                        alignItems: 'start',
                        justifyContent: 'center',
                        width: '50%', // Set chiều rộng chiếm 80% container cha
                        maxWidth: '1000px', // Đặt giới hạn chiều rộng tối đa
                        minWidth: '600px', // Đặt giới hạn chiều rộng tối thiểu
                        height: 'auto' // Đặt chiều cao tự động dựa vào nội dung (hoặc bạn có thể tùy chỉnh theo ý muốn)
                    }}
                >
                    {/* Form Section */}
                    <div
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography.Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
                            Soạn thảo
                        </Typography.Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            initialValues={{ type: 'outgoing' }}
                            style={{ overflowY: 'auto', maxHeight: '70vh' }}
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                <Form.Item
                                    label="Tiêu đề"
                                    name="title"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                >
                                    <Input placeholder="Nhập tiêu đề" />
                                </Form.Item>
                                <Form.Item
                                    label="Người gửi"
                                    name="sender"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn người gửi!' },
                                        {
                                            validator: (_, value) => {
                                                if (
                                                    value &&
                                                    (value === selectedRecipient || value === selectedReviewer)
                                                ) {
                                                    return Promise.reject(
                                                        'Người gửi không được trùng với người nhận hoặc người kiểm duyệt!'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Select placeholder="Chọn người gửi" onChange={(value) => setSelectedSender(value)}>
                                        {users.map((user: any) => (
                                            <Option key={user._id} value={user._id}>
                                                {user.fullname}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Người nhận"
                                    name="recipient"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn người nhận!' },
                                        {
                                            validator: (_, value) => {
                                                if (value && (value === selectedSender || value === selectedReviewer)) {
                                                    return Promise.reject(
                                                        'Người nhận không được trùng với người gửi hoặc người kiểm duyệt!'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn người nhận"
                                        onChange={(value) => setSelectedRecipient(value)}
                                    >
                                        {users.map((user: any) => (
                                            <Option key={user._id} value={user._id}>
                                                {user.fullname}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Người kiểm duyệt"
                                    name="reviewerId"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn nhân viên kiểm duyệt!' },
                                        {
                                            validator: (_, value) => {
                                                if (
                                                    value &&
                                                    (value === selectedSender || value === selectedRecipient)
                                                ) {
                                                    return Promise.reject(
                                                        'Người kiểm duyệt không được trùng với người gửi hoặc người nhận!'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn người kiểm duyệt"
                                        onChange={(value) => setSelectedReviewer(value)}
                                    >
                                        {users
                                            .filter((user: any) => user.role === 'admin')
                                            .map((user: any) => (
                                                <Option key={user._id} value={user._id}>
                                                    {user.fullname}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Ký hiệu"
                                    name="symbol"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng nhập ký hiệu!' }]}
                                >
                                    <Input placeholder="Nhập ký hiệu" />
                                </Form.Item>
                                <Form.Item
                                    label="Ngày ban hành"
                                    name="issueDate"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Ngày hết hạn"
                                    name="expirationDate"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Số trang"
                                    name="pageCount"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng nhập số trang!' }]}
                                >
                                    <Input placeholder="Nhập số trang" />
                                </Form.Item>
                                <Form.Item
                                    label="Số văn bản"
                                    name="documentNumber"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng nhập số văn bản!' }]}
                                >
                                    <Input placeholder="Nhập số văn bản" />
                                </Form.Item>
                                <Form.Item
                                    label="Tổ chức gửi"
                                    name="organization"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng nhập tổ chức gửi!' }]}
                                >
                                    <Input placeholder="Nhập tổ chức gửi" />
                                </Form.Item>

                                <Form.Item
                                    label="Loại công văn"
                                    name="categoryId"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn loại công văn!' }]}
                                >
                                    <Select placeholder="Chọn loại công văn">
                                        {categories &&
                                            categories.map((category) => (
                                                <Option key={category._id} value={category._id}>
                                                    {category.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Phòng ban"
                                    name="departmentId"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                                >
                                    <Select placeholder="Chọn phòng ban">
                                        {departments &&
                                            departments.map((department) => (
                                                <Option key={department._id} value={department._id}>
                                                    {department.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Lĩnh vực"
                                    name="fieldId"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực!' }]}
                                >
                                    <Select placeholder="Chọn lĩnh vực">
                                        {fields &&
                                            fields.map((field) => (
                                                <Option key={field._id} value={field._id}>
                                                    {field.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Phòng ban nhận"
                                    name="receivingDepartmentId"
                                    style={{ flex: '1 1 45%' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban nhận!' }]}
                                >
                                    <Select placeholder="Chọn phòng ban nhận">
                                        {departments &&
                                            departments.map((department) => (
                                                <Option key={department._id} value={department._id}>
                                                    {department.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Ghi chú" name="notes" style={{ flex: '1 1 100%' }}>
                                    <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
                                </Form.Item>
                                <Form.Item
                                    label="File văn bản"
                                    name="attachment"
                                    style={{ flex: '1 1 100%' }}
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e?.fileList}
                                    rules={[{ required: true, message: 'Vui lòng tải lên tệp đính kèm!' }]}
                                >
                                    <Upload beforeUpload={() => false} maxCount={1}>
                                        <Button icon={<PlusOutlined />}>Chọn tệp</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Thêm
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </Content>
            </Layout>
            <ToastContainer />
        </Layout>
    );
};

export default AddOutgoingDocument;
