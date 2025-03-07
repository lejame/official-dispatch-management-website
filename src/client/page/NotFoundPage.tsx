import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Xin lỗi, trang bạn tìm kiếm không tồn tại.</p>
            <Link to="/">Quay lại trang chủ</Link>
        </div>
    );
};

export default NotFoundPage;
