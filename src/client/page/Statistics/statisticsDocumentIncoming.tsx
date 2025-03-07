import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, DatePicker, message, Table, Tag, Typography } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import moment from 'moment';
import axiosInstance from '../../service/Axios';
import {
    TeamOutlined,
    MailOutlined,
    SendOutlined,
    UserOutlined,
    PaperClipOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const StatisticsDocumentIncoming: React.FC = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [managersCount, setManagersCount] = useState(0);
    const [pendingOutgoingDocs, setOutgoingDocment] = useState(0);
    const [pendingIngoingDocs, setIngoingDocment] = useState(0);

    const [fields, setFields] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    interface ChartData {
        total: { type: string; count: number }[];
        monthly: { month: string; type: string; value: number }[];
        pieData: { type: string; value: number }[];
    }

    const [chartData, setChartData] = useState<ChartData>({
        total: [],
        monthly: [],
        pieData: []
    });
    const [loading, setLoading] = useState(false);
    const [filterDates, setFilterDates] = useState({
        from: moment().startOf('year').format('DD/MM/YYYY'),
        to: moment().endOf('year').format('DD/MM/YYYY')
    });
    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get('/user');
            setEmployeeCount(response.data.length);
            const managers = response.data.filter((user: any) => user.role === 'admin');
            setManagersCount(managers.length);
        } catch (error) {
            message.error('Không thể tải danh sách nhân viên!');
        }
    };
    const fetchFields = async () => {
        try {
            const response = await axiosInstance.get('/document/field');
            setFields(response.data.data);
        } catch (error) {
            console.error('Lấy danh sách lĩnh vực thất bại!', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/document/category');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Lấy danh sách loại công văn thất bại!', error);
        }
    };
    const fetchDocuments = async (from: string, to: string) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/document/statistics', { from, to });
            const { incomingDocuments, outgoingDocuments } = response.data.data;
            console.log(incomingDocuments, outgoingDocuments);

            // Tính số lượng công văn đến và đi có trạng thái 'pending'
            const pendingIncomingDocs = incomingDocuments.filter(
                (doc: { status: string }) => doc.status === 'pending'
            ).length;
            const pendingOutgoingDocs = outgoingDocuments.filter(
                (doc: { status: string }) => doc.status === 'pending'
            ).length;
            setIngoingDocment(pendingIncomingDocs);
            setOutgoingDocment(pendingOutgoingDocs);

            setDocuments([...incomingDocuments, ...outgoingDocuments]);
            processChartData(incomingDocuments, outgoingDocuments);
        } catch (error) {
            message.error('Không thể tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (incomingDocs: any[], outgoingDocs: any[]) => {
        const total = [
            { type: 'Công văn đến', count: incomingDocs.length },
            { type: 'Công văn đi', count: outgoingDocs.length }
        ];

        const monthlyData: { month: string; type: string; value: number }[] = [];

        const monthly = Array.from({ length: 12 }, (_, i) => ({
            month: (i + 1).toString().padStart(2, '0'),
            incoming: 0,
            outgoing: 0
        }));

        [...incomingDocs, ...outgoingDocs].forEach((doc) => {
            const month = moment(doc.issueDate).format('MM');
            const isIncoming = incomingDocs.includes(doc);
            const targetMonth = monthly.find((m) => m.month === month);
            if (targetMonth) {
                if (isIncoming) targetMonth.incoming += 1;
                else targetMonth.outgoing += 1;
            }
        });

        monthly.forEach((item) => {
            monthlyData.push({ month: item.month, type: 'Công văn đến', value: item.incoming });
            monthlyData.push({ month: item.month, type: 'Công văn đi', value: item.outgoing });
        });

        const pieData = [
            { type: 'Công văn đến', value: incomingDocs.length },
            { type: 'Công văn đi', value: outgoingDocs.length }
        ];

        setChartData({ total, monthly: monthlyData, pieData });
    };

    // Lấy số công văn từ pieData
    const incomingDocs = chartData.pieData.find((item) => item.type === 'Công văn đến')?.value || 0;
    const outgoingDocs = chartData.pieData.find((item) => item.type === 'Công văn đi')?.value || 0;

    // Dữ liệu demo cho nhân viên, công văn đến và đi
    const stats = {
        employees: employeeCount, // Số lượng nhân viên
        incomingDocs: incomingDocs, // Công văn đến
        outgoingDocs: outgoingDocs, // Công văn đi
        managers: managersCount, // Số lượng quản lý
        pendingOutgoingDocs: pendingOutgoingDocs, // Số lượng công văn đi chờ duyệt
        pendingIncomingDocs: pendingIngoingDocs // Số lượng công văn đến chờ duyệt
    };

    const handleDateFilter = (type: 'day' | 'month' | 'year') => {
        const currentYear = moment().year();
        const today = moment();

        let fromDate: string;
        let toDate: string;

        if (type === 'day') {
            fromDate = today.format('DD/MM/YYYY');
            toDate = today.format('DD/MM/YYYY');
        } else if (type === 'month') {
            fromDate = moment(`${currentYear}-${today.month() + 1}-01`).format('DD/MM/YYYY');
            toDate = moment(fromDate, 'DD/MM/YYYY').endOf('month').format('DD/MM/YYYY');
        } else {
            fromDate = `01/01/${currentYear}`;
            toDate = `31/12/${currentYear}`;
        }

        setFilterDates({ from: fromDate, to: toDate });
    };

    const onDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setFilterDates({ from: dateStrings[0], to: dateStrings[1] });
        } else {
            setFilterDates({
                from: moment().startOf('year').format('YYYY-MM-DD'),
                to: moment().endOf('year').format('YYYY-MM-DD')
            });
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDocuments(filterDates.from, filterDates.to);
        fetchFields();
        fetchCategories();
    }, [filterDates]);

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Tổ chức gửi', dataIndex: 'organization', key: 'organization' },
        {
            title: 'Loại công văn',
            dataIndex: 'fieldId',
            key: 'fieldId',
            render: (fieldId: any) => {
                if (fieldId && typeof fieldId === 'object' && fieldId.name) {
                    return fieldId.name;
                } else if (fieldId) {
                    const field = fields.find((field) => field._id.toString() === fieldId.toString());
                    return field ? field.name : 'N/A';
                } else {
                    return 'N/A';
                }
            }
        },

        {
            title: 'Loại lĩnh vực',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId: any) => {
                if (categoryId && typeof categoryId === 'object' && categoryId.name) {
                    // Nếu categoryId là object và có thuộc tính name
                    return categoryId.name;
                } else if (categoryId) {
                    // Nếu categoryId là ID, tìm trong danh sách categories
                    const category = categories.find((category) => category._id.toString() === categoryId.toString());
                    return category ? category.name : 'N/A';
                } else {
                    // Nếu categoryId null hoặc không tồn tại
                    return 'N/A';
                }
            }
        },
        {
            title: 'Ngày nhận',
            dataIndex: 'issueDate',
            key: 'issueDate',
            render: (date: string) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'pending':
                        color = 'red';
                        text = 'Chưa duyệt';
                        break;
                    case 'handled':
                        color = 'orange';
                        text = 'Đã xác nhận';
                        break;
                    case 'approved':
                        color = 'green';
                        text = 'Đã được duyệt';
                        break;
                    case 'rejected':
                        color = 'volcano';
                        text = 'Bị từ chối';
                        break;
                    default:
                        color = 'default';
                        text = 'Không xác định';
                        break;
                }

                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Kiểu công văn',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'incoming' ? 'blue' : 'purple'}>
                    {type === 'incoming' ? 'Công văn đến' : 'Công văn đi'}
                </Tag>
            )
        }
    ];

    const pieConfig = {
        appendPadding: 10,
        data: chartData.pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}'
        }
    };

    const monthlyBarConfig = {
        data: (chartData.monthly || []).map((item: any) => ({
            ...item,
            value: Math.floor(item.value) // Chuyển đổi sang số nguyên
        })),
        isGroup: false,
        xField: 'month',
        yField: 'value',
        seriesField: 'type',
        label: {
            position: 'middle',
            layout: [{ type: 'interval-adjust-position' }, { type: 'interval-hide-overlap' }, { type: 'adjust-color' }]
        },
        color: ({ type }: { type: string }) => {
            return type === 'Công văn đến' ? '#1890ff' : '#52c41a';
        },
        yAxis: {
            max: 10 // Giới hạn trục y tối đa là 10
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ marginBottom: '20px', justifyContent: 'center', textAlign: 'center' }}>
                Thống Kê
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                {/* Card Số lượng nhân viên */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#8D6E63', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <TeamOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.employees}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng nhân viên</div>
                            </div>
                        </Row>
                    </Card>
                </Col>

                {/* Card Số lượng công văn đến */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#FFB300', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <MailOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.incomingDocs}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng công văn đến</div>
                            </div>
                        </Row>
                    </Card>
                </Col>

                {/* Card Số lượng công văn đi */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#66BB6A', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <SendOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.outgoingDocs}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng công văn đi</div>
                            </div>
                        </Row>
                    </Card>
                </Col>

                {/* Card Số lượng quản lý */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#F57C00', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <UserOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.managers}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng quản lý</div>
                            </div>
                        </Row>
                    </Card>
                </Col>

                {/* Card Công văn đến chưa duyệt */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#1E88E5', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <FileTextOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.pendingIncomingDocs}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng công văn đến chưa duyệt</div>
                            </div>
                        </Row>
                    </Card>
                </Col>

                {/* Card Công văn đi chưa duyệt */}
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ backgroundColor: '#C62828', padding: '20px', borderRadius: '10px' }}
                    >
                        <Row justify="space-between">
                            <PaperClipOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                    {stats.pendingOutgoingDocs}
                                </div>
                                <div style={{ color: '#fff' }}>Số lượng công văn đi chưa duyệt</div>
                            </div>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginBottom: '20px', borderRadius: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col>
                        <Button onClick={() => handleDateFilter('day')}>Hôm nay</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => handleDateFilter('month')}>Tháng này</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => handleDateFilter('year')}>Năm nay</Button>
                    </Col>
                    <Col>
                        <RangePicker format="DD/MM/YYYY" onChange={onDateRangeChange} />
                    </Col>
                </Row>
            </Card>

            <Card title="Danh Sách Công Văn" style={{ marginBottom: '20px', borderRadius: '10px' }}>
                <Table
                    dataSource={documents}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 3 }}
                />
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Tỷ Lệ Công Văn Đến Và Đi" style={{ borderRadius: '10px' }}>
                        <Pie {...pieConfig} />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Số Lượng Công Văn Theo Tháng" style={{ borderRadius: '10px' }}>
                        <Column {...monthlyBarConfig} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsDocumentIncoming;
