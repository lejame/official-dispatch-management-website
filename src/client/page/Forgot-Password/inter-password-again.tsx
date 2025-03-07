import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';

const InterNewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setPassword(e.target.value);
        setError(''); // Clear error on input
    };

    const handleConfirmPasswordChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setConfirmPassword(e.target.value);
        setError(''); // Clear error on input
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            setError('Token không hợp lệ');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp. Vui lòng kiểm tra lại.');
            return;
        }

        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }

        try {
            await axios.post('/api/auth/reset-password', { token, password });
            setSuccess(true);
        } catch (err) {
            setError('Đặt lại mật khẩu thất bại. Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
        }
    };

    return (
        <MDBContainer
            fluid
            className="reset-password-page"
            style={{
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '15px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                margin: 'auto',
                marginTop: '100px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <form onSubmit={handleSubmit}>
                <MDBRow className="g-0 align-items-center justify-content-center">
                    <MDBCol md="12" className="text-center">
                        <h2 className="mb-4" style={{ color: '#333' }}>
                            Tạo Mật Khẩu Mới
                        </h2>
                        <p className="mb-4" style={{ color: '#555', fontSize: '14px' }}>
                            Xin vui lòng nhập mật khẩu mới của bạn.
                        </p>

                        {/* Input Password */}
                        <MDBInput
                            required
                            wrapperClass="mb-3"
                            label="Mật khẩu mới"
                            id="passwordInput"
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={handlePasswordChange}
                        />

                        {/* Confirm Password */}
                        <MDBInput
                            required
                            wrapperClass="mb-3"
                            label="Xác nhận mật khẩu"
                            id="confirmPasswordInput"
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />

                        {/* Hiển thị lỗi nếu có */}
                        {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}

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
                                Mật khẩu đã được cập nhật thành công!
                            </div>
                        )}

                        {/* Nút gửi */}
                        {!success && (
                            <MDBBtn className="w-100 mt-4" color="primary" type="submit">
                                Cập nhật mật khẩu
                            </MDBBtn>
                        )}
                    </MDBCol>
                </MDBRow>
            </form>

            <MDBRow className="g-0 align-items-center justify-content-center mt-4">
                <MDBCol md="12" className="text-center">
                    <MDBBtn color="secondary" href="/login">
                        Trở về trang đăng nhập
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default InterNewPassword;
