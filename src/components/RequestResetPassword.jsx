import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/reset-password', { email });
      alert(data.message)
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Request Password Reset</button>
    </form>
  );
};

export default RequestPasswordReset;
