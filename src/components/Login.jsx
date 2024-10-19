import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token); // Store JWT token
            console.log(response);
            
            // Redirect based on user role
            const userRole = response.data.role; // Assuming you get user data in the response
            console.log(userRole);
            if (userRole === 'admin') {
                navigate('/admin'); // Redirect to admin page
            } else {
                navigate('/dashboard'); // Redirect to user dashboard or home page
            }
            
        } catch (error) {
            console.error('Login error:', error.response.data.message);
            alert( error.response.data.message);
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            <div>
                <p>Don't have an account? <a href="/register">Register</a></p>
                <p>Forgot your password? <a href="/forgot-password">Reset Password</a></p>
            </div>
        </div>
    );
};

export default Login;
