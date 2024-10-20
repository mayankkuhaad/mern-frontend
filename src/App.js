import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Admin = lazy(() => import('./components/Admin'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const EditUser = lazy(() => import('./components/EditUser'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const RequestPasswordReset = lazy(() => import('./components/RequestResetPassword'));
const ResetPassword = lazy(() => import('./components/SetNewPassword'));
const UserList = lazy(() => import('./components/UserList'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const SeeUserProfile = lazy(() => import('./components/SeeUserProfile'));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Register />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/forgot-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/user-list/:id" element={<SeeUserProfile />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Routes>
        </Suspense>
      </Router>

      <Toaster />
    </>
  );
}

export default App;
