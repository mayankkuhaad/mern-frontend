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
    <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
    <form className="py-4 md:py-0"  onSubmit={handleSubmit}>
      <h2 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">Enter New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
        text-headingColor placeholder:text-textColor  cursor-pointer"
      />
      <button
              className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg" type="submit">Reset Password</button>
    </form>
    </div>
  );
};

export default ResetPassword;
