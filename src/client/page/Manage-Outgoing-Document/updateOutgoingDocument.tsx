import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Select, Input, Button, message, Card, Descriptions, DatePicker, Modal, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../service/Axios';
import moment from 'moment';

const { Option } = Select;

const UpdateOutgoingDocument: React.FC = () => {
    const location = useLocation();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [sender, setSender] = useState<any>(null);
    const [receiver, setReceiver] = useState<any>(null);
    const [reviewer, setReviewer] = useState<any>(null);
    const [fields, setFields] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [users, setUsers] = useState<unknown[]>([]);
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        if (id) {
            fetchDocument(id);
        }
        fetchDropdownData();
    }, [location.search]);

    const fetchDocument = async (id: string) => {
        try {
            const response = await axiosInstance.post(`/document/outgoing/get-by-id`, { id });
            const docData = response.data.data;

            setDocument(docData);
            form.setFieldsValue({
                ...docData,
                issueDate: moment(docData.issueDate),
                expirationDate: moment(docData.expirationDate)
            });

            // Đồng thời lấy thông tin người gửi và người nhận
            await fetchUsersDetails(docData.sender, docData.recipient, docData.userId);
            setLoading(false);
        } catch (error) {
            message.error('Lấy thông tin công văn thất bại!');
            setLoading(false);
        }
    };

    const fetchUsersDetails = async (senderId: string, recipientId: string, reviewerId: string) => {
        try {
            const promises = [];
            if (senderId) promises.push(axiosInstance.post('/user/get-user-by-id', { id: senderId }));
            if (recipientId) promises.push(axiosInstance.post('/user/get-user-by-id', { id: recipientId }));
            if (reviewerId) promises.push(axiosInstance.post('/user/get-user-by-id', { id: reviewerId }));

            const [senderResponse, receiverResponse, reviewerResponse] = await Promise.all(promises);
            if (senderResponse) setSender(senderResponse.data.data);
            if (receiverResponse) setReceiver(receiverResponse.data.data);
            if (reviewerResponse) setReviewer(reviewerResponse.data.data);
        } catch (error) {
            message.error('Lấy thông tin người gửi hoặc người nhận thất bại!');
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [fieldsRes, departmentsRes, categoriesRes, usersRes] = await Promise.all([
                axiosInstance.get('/document/field'),
                axiosInstance.get('/department'),
                axiosInstance.get('/document/category'),
                axiosInstance.get('/user')
            ]);

            setFields(fieldsRes.data.data);
            setDepartments(departmentsRes.data.data);
            setCategories(categoriesRes.data.data);
            setUsers(usersRes.data);
        } catch (error) {
            message.error('Lấy dữ liệu các danh mục thất bại!');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (values: any) => {
        const finalData = {
            title: values.title !== document.title ? values.title : document.title,
            categoryId: values.categoryId !== document.categoryId ? values.categoryId : document.categoryId,
            departmentId: values.departmentId !== document.departmentId ? values.departmentId : document.departmentId,
            receivingDepartmentId:
                values.receivingDepartmentId !== document.receivingDepartmentId
                    ? values.receivingDepartmentId
                    : document.receivingDepartmentId,
            fieldId: values.fieldId !== document.fieldId ? values.fieldId : document.fieldId,
            symbol: values.symbol !== document.symbol ? values.symbol : document.symbol,
            issueDate: values.issueDate ? values.issueDate.toISOString() : document.issueDate,
            expirationDate: values.expirationDate ? values.expirationDate.toISOString() : document.expirationDate,
            recipient: values.recipient !== document.recipient ? values.recipient : document.recipient,
            sender: values.sender !== document.sender ? values.sender : document.sender,
            pageCount: values.pageCount !== document.pageCount ? values.pageCount : document.pageCount,
            documentNumber:
                values.documentNumber !== document.documentNumber ? values.documentNumber : document.documentNumber,
            organization: values.organization !== document.organization ? values.organization : document.organization,
            notes: values.notes !== document.notes ? values.notes : document.notes,
            id: document._id,
            userId: selectedReviewer || document.userId
        };

        try {
            await axiosInstance.post('/document/outgoing/update', finalData);
            await axiosInstance.post('/notification/create', {
                userId: values.userId,
                documentId: document._id,
                message: `Bạn đã được gán kiểm duyệt công văn: ${document.title}`
            });

            message.success('Cập nhật công văn thành công!');
            handleCloseModal();
            fetchDocument(document._id);
        } catch (error) {
            message.error('Cập nhật công văn thất bại!');
        }
    };
    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '20% auto' }} />;
    }

    if (!document) {
        return <div>Không tìm thấy công văn</div>;
    }

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <Card
                title="Thông Tin Chi Tiết Công Văn Đi"
                bordered={false}
                style={{ marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Tiêu đề">{document.title}</Descriptions.Item>
                    <Descriptions.Item label="Người gửi">{sender?.fullname || 'Không có thông tin'}</Descriptions.Item>
                    <Descriptions.Item label="Người nhận">
                        {receiver?.fullname || 'Không có thông tin'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người kiểm duyệt">
                        {reviewer?.fullname || 'Không có thông tin'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ký hiệu">{document.symbol}</Descriptions.Item>
                    <Descriptions.Item label="Loại công văn">
                        {categories.find((cat) => cat._id === document.categoryId)?.name || 'Không có'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">
                        {departments.find((dept) => dept._id === document.departmentId)?.name || 'Không có'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban nhận">
                        {departments.find((dept) => dept._id === document.receivingDepartmentId)?.name || 'Không có'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lĩnh vực">
                        {fields.find((field) => field._id === document.fieldId)?.name || 'Không có'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày ban hành">
                        {moment(document.issueDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày hết hạn">
                        {moment(document.expirationDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số trang">{document.pageCount}</Descriptions.Item>
                    <Descriptions.Item label="Số văn bản">{document.documentNumber}</Descriptions.Item>
                    <Descriptions.Item label="Tổ chức gửi">{document.organization}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{document.notes || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="Tệp đính kèm">
                        <a href={document.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            {document.attachmentName}
                        </a>
                    </Descriptions.Item>
                </Descriptions>
                <div style={{ textAlign: 'end', color: '#1890ff' }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{ marginTop: '20px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                        onClick={handleOpenModal}
                    >
                        Chỉnh sửa
                    </Button>
                </div>
            </Card>

            {/* Modal Chỉnh sửa */}
            <Modal
                title="Chỉnh Sửa Công Văn"
                visible={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                centered
                style={{ top: 20, right: 0, maxWidth: '500px' }}
                bodyStyle={{ padding: '20px' }}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* ------------------------------------------------------------------------ */}
                    <Form.Item
                        label="Người gửi"
                        name="sender"
                        rules={[
                            { required: true, message: 'Vui lòng chọn người gửi!' },
                            {
                                validator: (_, value) => {
                                    if (value && (value === selectedRecipient || value === selectedReviewer)) {
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
                        <Select placeholder="Chọn người nhận" onChange={(value) => setSelectedRecipient(value)}>
                            {users.map((user: any) => (
                                <Option key={user._id} value={user._id}>
                                    {user.fullname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Người kiểm duyệt"
                        name="userId"
                        rules={[
                            { required: true, message: 'Vui lòng chọn người kiểm duyệt!' },
                            {
                                validator: (_, value) => {
                                    if (value && (value === selectedSender || value === selectedRecipient)) {
                                        return Promise.reject(
                                            'Người kiểm duyệt không được trùng với người gửi hoặc người nhận!'
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Select placeholder="Chọn người kiểm duyệt" onChange={(value) => setSelectedReviewer(value)}>
                            {users
                                .filter((user: any) => user.role === 'admin')
                                .map((user: any) => (
                                    <Option key={user._id} value={user._id}>
                                        {user.fullname}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                    {/* ------------------------------------------------------------------------ */}
                    <Form.Item
                        label="Ký hiệu"
                        name="symbol"
                        rules={[{ required: true, message: 'Vui lòng nhập ký hiệu!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Loại công văn"
                        name="categoryId"
                        rules={[{ required: true, message: 'Chọn loại công văn!' }]}
                    >
                        <Select placeholder="Chọn loại công văn">
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Phòng ban"
                        name="departmentId"
                        rules={[{ required: true, message: 'Chọn phòng ban!' }]}
                    >
                        <Select placeholder="Chọn phòng ban">
                            {departments.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Phòng ban nhận"
                        name="receivingDepartmentId"
                        rules={[{ required: true, message: 'Chọn phòng ban nhận!' }]}
                    >
                        <Select placeholder="Chọn phòng ban nhận">
                            {departments.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Lĩnh vực" name="fieldId" rules={[{ required: true, message: 'Chọn lĩnh vực!' }]}>
                        <Select placeholder="Chọn lĩnh vực">
                            {fields.map((field) => (
                                <Option key={field._id} value={field._id}>
                                    {field.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Ngày ban hành"
                        name="issueDate"
                        rules={[{ required: true, message: 'Chọn ngày ban hành!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày hết hạn"
                        name="expirationDate"
                        rules={[{ required: true, message: 'Chọn ngày hết hạn!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Số trang"
                        name="pageCount"
                        rules={[{ required: true, message: 'Nhập số trang!' }]}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>
                    <Form.Item
                        label="Số văn bản"
                        name="documentNumber"
                        rules={[{ required: true, message: 'Nhập số văn bản!' }]}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>
                    <Form.Item
                        label="Tổ chức gửi"
                        name="organization"
                        rules={[{ required: true, message: 'Nhập tổ chức gửi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="notes">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Lưu chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateOutgoingDocument;
