import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axiosInstance from '../../service/Axios'; // Import axiosInstance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DocumentType {
    _id: string;
    name: string;
}

const DocumentTypesPage: React.FC = () => {
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const currentDocumentTypeRef = useRef<DocumentType | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    const [form] = Form.useForm();

    useEffect(() => {
        fetchDocumentTypes();
    }, [searchText]);

    const fetchDocumentTypes = async () => {
        try {
            const response = await axiosInstance.get('/document/category');
            const filteredDocumentTypes = response.data.data.filter((documentType: DocumentType) =>
                documentType.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setDocumentTypes(filteredDocumentTypes);
        } catch (error) {
            toast.error('Lấy danh sách loại công văn thất bại!');
        }
    };

    const handleAddDocumentType = async (values: { name: string }) => {
        try {
            const response = await axiosInstance.post('/document/category/create', values);
            setDocumentTypes([...documentTypes, response.data.data]);
            setIsAddModalVisible(false);
            form.resetFields();
            toast.success('Thêm loại công văn thành công!');
        } catch (error) {
            toast.error('Thêm loại công văn thất bại!');
        }
    };

    const handleEditDocumentType = async (values: { name: string }) => {
        const currentDocumentType = currentDocumentTypeRef.current;
        if (!currentDocumentType) return;
        try {
            const response = await axiosInstance.post('/document/category/update', {
                id: currentDocumentType._id,
                name: values.name
            });
            setDocumentTypes(
                documentTypes.map((documentType) =>
                    documentType._id === currentDocumentType._id
                        ? { ...documentType, name: response.data.data.name }
                        : documentType
                )
            );
            setIsEditModalVisible(false);
            currentDocumentTypeRef.current = null;
            form.resetFields();
            toast.success('Cập nhật loại công văn thành công!');
        } catch (error) {
            toast.error('Cập nhật loại công văn thất bại!');
        }
    };

    const handleDeleteDocumentType = async (id: string) => {
        try {
            await axiosInstance.post('/document/category/delete', { id });
            setDocumentTypes(documentTypes.filter((documentType) => documentType._id !== id));
            toast.success('Xóa loại công văn thành công!');
            fetchDocumentTypes();
        } catch (error) {
            toast.error('Xóa loại công văn thất bại!');
        }
    };

    const columns = [
        {
            title: 'Tên loại công văn',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: DocumentType) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => {
                            currentDocumentTypeRef.current = record;
                            form.setFieldsValue({ name: record.name });
                            setIsEditModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteDocumentType(record._id)}>
                        Xóa
                    </Button>
                </span>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: '20px' }}>
                    Thêm loại công văn
                </Button>
                <Input
                    placeholder="Tìm kiếm loại công văn"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>
            <Table dataSource={documentTypes} columns={columns} rowKey="_id" />

            <Modal
                title="Thêm loại công văn"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddDocumentType}>
                    <Form.Item
                        label="Tên loại công văn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại công văn!' }]}
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
                title="Sửa loại công văn"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleEditDocumentType}>
                    <Form.Item
                        label="Tên loại công văn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại công văn!' }]}
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

export default DocumentTypesPage;
