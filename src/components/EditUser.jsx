import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: 'user', // Default role
    });
    const { id } = useParams(); // Get the user ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from local storage
                const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the authorization header
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error.response?.data?.message || error.message);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            await axios.put(`http://localhost:5000/api/auth/users/${id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`, // Set the authorization header
                },
            });

            window.alert(`Successfully updated user`);
            navigate('/admin/users'); // Redirect to the admin page after updating
        } catch (error) {
            console.error('Error updating user:', error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Role</label>
                <select name="role" value={user.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit">Update User</button>
        </form>
    );
};

export default EditUser;
