import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome Admin! You have special permissions here.</p>
            <Link to="/admin/users">Manage Users</Link> 
        </div>
    );
};

export default Admin;
