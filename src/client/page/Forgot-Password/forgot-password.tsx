import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleEmailChange = (e: { target: { value: any } }) => {
        const value = e.target.value;
        setEmail(value);

        // Kiểm tra xem email có đuôi là @gmail.com
        if (value && !value.endsWith('@gmail.com')) {
            setError('Email phải có đuôi @gmail.com');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!email.endsWith('@gmail.com')) {
            setError('Vui lòng nhập email hợp lệ với đuôi @gmail.com');
            return;
        }

        try {
            await axios.post('/api/auth/forgot-password', { email });
            setError('');
            setSuccess(true);
        } catch (err) {
            setError('Gửi yêu cầu thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <MDBContainer
            fluid
            className="forgot-password-page"
            style={{
                maxWidth: '600px',
                height: '60vh',
                borderRadius: '15px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                margin: 'auto',
                marginTop: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <form onSubmit={handleSubmit}>
                <MDBRow className="g-0 align-items-center justify-content-center">
                    <MDBCol md="12" className="text-center">
                        <h2 className="mb-4" style={{ color: '#333' }}>
                            Quên Mật Khẩu
                        </h2>
                        <p className="mb-4" style={{ color: '#555', fontSize: '14px' }}>
                            Vui lòng nhập email của bạn để nhận đường dẫn tạo lại mật khẩu.
                        </p>

                        {/* Input Email */}
                        <MDBInput
                            required
                            wrapperClass="mb-2"
                            label="Email"
                            id="emailInput"
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={handleEmailChange}
                        />

                        {/* Hiển thị lỗi nếu có */}
                        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

                        {/* Hiển thị thông báo thành công */}
                        {success && (
                            <div
                                style={{
                                    backgroundColor: '#d4edda',
                                    color: '#155724',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginTop: '15px',
                                    border: '1px solid #c3e6cb',
                                    textAlign: 'center'
                                }}
                            >
                                Đã gửi yêu cầu! Vui lòng kiểm tra email <strong>{email}</strong> để lấy lại mật khẩu.
                            </div>
                        )}

                        {/* Nút gửi */}
                        {!success && (
                            <MDBBtn className="w-100 mt-3" color="primary" type="submit" disabled={!!error}>
                                Gửi yêu cầu
                            </MDBBtn>
                        )}
                    </MDBCol>
                </MDBRow>
            </form>
        </MDBContainer>
    );
};

export default ForgotPassword;
