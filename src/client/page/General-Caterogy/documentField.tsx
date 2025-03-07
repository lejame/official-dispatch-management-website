import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axiosInstance from '../../service/Axios'; // Import axiosInstance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DocumentField {
    _id: string;
    name: string;
}

const DocumentFieldPage: React.FC = () => {
    const [documentFields, setDocumentFields] = useState<DocumentField[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const currentDocumentFieldRef = useRef<DocumentField | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    const [form] = Form.useForm();

    useEffect(() => {
        fetchDocumentFields();
    }, [searchText]);

    const fetchDocumentFields = async () => {
        try {
            const response = await axiosInstance.get('/document/field');
            const filteredDocumentFields = response.data.data.filter((documentField: DocumentField) =>
                documentField.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setDocumentFields(filteredDocumentFields);
        } catch (error) {
            toast.error('Lấy danh sách lĩnh vực công văn thất bại!');
        }
    };

    const handleAddDocumentField = async (values: { name: string }) => {
        try {
            const response = await axiosInstance.post('/document/field/create', values);
            setDocumentFields([...documentFields, response.data.data]);
            setIsAddModalVisible(false);
            form.resetFields();
            toast.success('Thêm lĩnh vực công văn thành công!');
        } catch (error) {
            toast.error('Thêm lĩnh vực công văn thất bại!');
        }
    };

    const handleEditDocumentField = async (values: { name: string }) => {
        const currentDocumentField = currentDocumentFieldRef.current;
        if (!currentDocumentField) return;
        try {
            const response = await axiosInstance.post('/document/field/update', {
                id: currentDocumentField._id,
                name: values.name
            });
            setDocumentFields(
                documentFields.map((documentField) =>
                    documentField._id === currentDocumentField._id
                        ? { ...documentField, name: response.data.data.name }
                        : documentField
                )
            );
            setIsEditModalVisible(false);
            currentDocumentFieldRef.current = null;
            form.resetFields();
            toast.success('Cập nhật lĩnh vực công văn thành công!');
        } catch (error) {
            toast.error('Cập nhật lĩnh vực công văn thất bại!');
        }
    };

    const handleDeleteDocumentField = async (id: string) => {
        try {
            await axiosInstance.post('/document/field/delete', { id });
            setDocumentFields(documentFields.filter((documentField) => documentField._id !== id));
            toast.success('Xóa lĩnh vực công văn thành công!');
            fetchDocumentFields();
        } catch (error) {
            toast.error('Xóa lĩnh vực công văn thất bại!');
        }
    };

    const columns = [
        {
            title: 'Tên lĩnh vực công văn',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: DocumentField) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => {
                            currentDocumentFieldRef.current = record;
                            form.setFieldsValue({ name: record.name });
                            setIsEditModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteDocumentField(record._id)}>
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
                    Thêm lĩnh vực công văn
                </Button>
                <Input
                    placeholder="Tìm kiếm lĩnh vực công văn"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>

            <Table dataSource={documentFields} columns={columns} rowKey="_id" />

            <Modal
                title="Thêm lĩnh vực công văn"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddDocumentField}>
                    <Form.Item
                        label="Tên lĩnh vực công văn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên lĩnh vực công văn!' }]}
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
                title="Sửa lĩnh vực công văn"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleEditDocumentField}>
                    <Form.Item
                        label="Tên lĩnh vực công văn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên lĩnh vực công văn!' }]}
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

export default DocumentFieldPage;
