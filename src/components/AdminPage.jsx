import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (!token) {
                navigate('/login'); // Redirect to login if no token found
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/admin', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Pass the JWT token in the request headers
                    }
                });
                setMessage(response.data.message); // Get the message from the backend
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // If access is forbidden, handle it (e.g., redirect to a forbidden page)
                    alert('Access Denied');
                    navigate('/'); // Redirect to home or another page
                } else {
                    console.error('Error fetching admin data:', error);
                }
            }
        };

        fetchAdminData();
    }, [navigate]);

    return (
        <div>
            <h1>Admin Page</h1>
            <p>{message}</p>
        </div>
    );
};

export default AdminPage;
