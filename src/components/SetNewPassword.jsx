import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams(); // token from the URL
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { newPassword });
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
