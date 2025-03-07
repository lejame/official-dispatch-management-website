import React, { useState, useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from '../../utils/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });
            const { token } = response.data.data;
            localStorage.setItem('jwtToken', token);
            navigate('/');
        } catch (err) {
            // setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            }
        }
    };

    return (
        <MDBContainer
            fluid
            className="login-page"
            style={{
                maxWidth: '900px',
                height: '80vh',
                borderRadius: '15px',
                backgroundColor: '#f8f9fa',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                margin: 'auto',
                marginTop: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <MDBRow className="g-0 align-items-center justify-content-center">
                <MDBCol md="8">
                    <img
                        src="src/client/assets/login.jpg"
                        alt="Logo"
                        className="logo mb-3"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '10px'
                        }}
                    />
                </MDBCol>
                <MDBCol md="4" className="right-panel d-flex align-items-center justify-content-center ps-2">
                    <div className="login-form">
                        <h2 className="text-center mb-4 text-black">XIN CHÀO!</h2>
                        <form onSubmit={handleLogin}>
                            <MDBInput
                                wrapperClass="mb-4"
                                label="Tài khoản"
                                id="form1"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="Mật khẩu"
                                id="form2"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <MDBBtn className="w-100 mb-4" color="danger" type="submit">
                                ĐĂNG NHẬP
                            </MDBBtn>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Link to={'/forgot-password'} style={{ color: 'blue' }}>
                                Quên mật khẩu ?
                            </Link>
                        </div>
                        <p className="text-muted text-center">Đăng nhập để sử dụng hệ thống thông tin nhé!</p>
                    </div>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default LoginPage;
