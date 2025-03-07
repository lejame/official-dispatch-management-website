import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserProfile from '../page/HR-Account-Management/userProfile';
import UserList from '../page/HR-Account-Management/userList';
import AddUser from '../page/HR-Account-Management/adddUser';
import LoginPage from '../page/login/login';
import ForgotPassword from '../page/Forgot-Password/forgot-password';
import InterNewPassword from '../page/Forgot-Password/inter-password-again';
import DocumentReception from '../page/Manage-Incoming-Documents/receiveDocument';
import DocumentRecording from '../page/Manage-Incoming-Documents/recordDocument';
import IncomingDocumentStatistics from '../page/Statistics/statisticsDocumentIncoming';
import EmployeeList from '../page/Approve-Documents/user_assignment';
import DepartmentList from '../page/General-Caterogy/department';
import DocumentTypeList from '../page/General-Caterogy/documentTypes';
import DocumentFieldList from '../page/General-Caterogy/documentField';
import SideNav from '../component/layout/side/sideNav';
import Header from '../component/layout/header/header';
import PrivateRoute from '../component/PrivateRoute';
import NotFoundPage from '../page/NotFoundPage';
import { isAuthenticated } from '../utils/auth';
import AddOutgoingDocument from '../page/Manage-Outgoing-Document/addOutgoingDocument';
import UpdateOutgoingDocument from '../page/Manage-Outgoing-Document/updateOutgoingDocument';
import EmployeeApproval from '../page/Approve-Documents/user_assignment';
import OutgoingDocumentsList from '../page/Manage-Outgoing-Document/OutgoingDocumentsList';
import IncomingDocumentApproval from '../page/Manage-Incoming-Documents/approvalDocument';
import OutgoingDocumentApproval from '../page/Manage-Outgoing-Document/approvalDocument';
const AppRoutes: React.FC<{
    darkTheme: boolean;
    setDarkTheme: (value: boolean) => void;
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}> = ({ darkTheme, setDarkTheme, collapsed, setCollapsed }) => {
    return (
        <Routes>
            {/* Routes without SideNav and Header */}
            <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/new-password" element={<InterNewPassword />} />

            {/* Routes with SideNav and Header */}
            <Route
                path="*"
                element={
                    <div style={{ display: 'flex', minHeight: '100vh' }}>
                        <SideNav
                            darkTheme={darkTheme}
                            setDarkTheme={setDarkTheme}
                            setCollapsed={setCollapsed}
                            collapsed={collapsed}
                        />
                        <div style={{ flex: 1, padding: '20px' }}>
                            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                            <Routes>
                                <Route path="/" element={<PrivateRoute element={DocumentReception} />} />
                                <Route
                                    path="/add-outgoing-document"
                                    element={<PrivateRoute element={AddOutgoingDocument} />}
                                />
                                <Route
                                    path="/outgoing-document-list"
                                    element={<PrivateRoute element={OutgoingDocumentsList} />}
                                />

                                <Route
                                    path="/update-outgoing-document"
                                    element={<PrivateRoute element={UpdateOutgoingDocument} />}
                                />
                                <Route path="/user-profile" element={<PrivateRoute element={UserProfile} />} />
                                <Route path="/user-list" element={<PrivateRoute element={UserList} />} />
                                <Route path="/add-user" element={<PrivateRoute element={AddUser} />} />
                                <Route
                                    path="/receive-document"
                                    element={<PrivateRoute element={DocumentReception} />}
                                />
                                <Route
                                    path="/approve-incoming-document"
                                    element={<PrivateRoute element={IncomingDocumentApproval} />}
                                />
                                <Route
                                    path="/approve-outgoing-document"
                                    element={<PrivateRoute element={OutgoingDocumentApproval} />}
                                />
                                <Route path="/record-document" element={<PrivateRoute element={DocumentRecording} />} />
                                <Route
                                    path="/statistic-document-incoming"
                                    element={<PrivateRoute element={IncomingDocumentStatistics} />}
                                />
                                <Route path="/employ" element={<PrivateRoute element={EmployeeList} />} />
                                <Route path="/department" element={<PrivateRoute element={DepartmentList} />} />
                                <Route path="/document-types" element={<PrivateRoute element={DocumentTypeList} />} />
                                <Route path="/document-fields" element={<PrivateRoute element={DocumentFieldList} />} />
                                <Route
                                    path="/employee-approval"
                                    element={<PrivateRoute element={EmployeeApproval} />}
                                />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
