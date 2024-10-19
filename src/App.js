import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import UserManagement from './components/UserManagement';
import EditUser from './components/EditUser';
import UserProfile from './components/UserProfile';
import RequestPasswordReset from './components/RequestResetPassword';
import ResetPassword from './components/SetNewPassword';
import UserList from './components/UserList';

function App() {
  return (
      <Router>
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
          </Routes>
      </Router>
  );
}

export default App;
