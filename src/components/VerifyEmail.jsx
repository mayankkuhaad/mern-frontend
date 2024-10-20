import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { serverUrl } from '../index';

const VerifyEmail = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          toast.error('Invalid verification link');
          return;
        }

        const { data } = await axios.get(`${serverUrl}/auth/verify-email`, {
          params: { token }, 
        });
        
        if (data.success) {
          toast.success('Email verified successfully!');
          navigate('/login');
        } else {
          toast.error(data.message || 'Verification failed');
        }
      } catch (error) {
        toast.error('Error verifying email. Please try again.');
      }
    };

    verifyEmail();
  }, [navigate, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
      <p className="text-gray-700">Please wait while we verify your email.</p>
    </div>
  );
};

export default VerifyEmail;