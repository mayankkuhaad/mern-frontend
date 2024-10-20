import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import Loader from './Loader';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.user;
        setValue('name', userData.name);
        setValue('email', userData.email);
        setPreviewUrl(userData.photoUrl);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [setValue]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewUrl(previewURL);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const submissionData = new FormData();

    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);

    if (selectedFile) {
      submissionData.append('photo', selectedFile);
    }

    try {
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(data.message);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full mt-8 max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
      <h1 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">EDIT PROFILE</h1>
      
      <form className="py-4 md:py-0" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name', {
              required: 'Name is required',
            })}
            className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
            focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
            text-headingColor placeholder:text-textColor cursor-pointer"
          />
          {errors.name && <p className="text-red-700">{errors.name.message}</p>}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Enter a valid email',
              },
            })}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61]
            focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
            text-headingColor placeholder:text-textColor cursor-pointer"
          />
          {errors.email && <p className="text-red-700">{errors.email.message}</p>}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div className="mt-4">
            {previewUrl && (
              <div className="mb-4" style={{ width: '200px', height: '200px', border: '1px solid' }}>
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}

            <input
              type="file"
              name="photo"
              onChange={handleFileInputChange}
              accept="image/*"
              className="mt-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
