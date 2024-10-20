import React, { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";

import { HashLoader } from "react-spinners";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post('http://localhost:5000/api/auth/reset-password', { email });
      toast.success(data.message);
      setLoading(false);

    } catch (error) {
      setLoading(false);

      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
  <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
    <form className="py-4 md:py-0" onSubmit={handleSubmit}>
      <div className="mb-5">

      <h2 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
        text-headingColor placeholder:text-textColor  cursor-pointer"
        required
      />
      <button type="submit" 
        className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
        disabled={loading}
      >{loading ? <HashLoader size={35} color="#ffffff" /> : "Request Password Reset"}
      </button>
      </div>

    </form>
  </div>
  );
};

export default RequestPasswordReset;
