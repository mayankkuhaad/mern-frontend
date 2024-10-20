import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from "react-hot-toast";
import Loader from './Loader';
import { useForm } from 'react-hook-form';

const EditUser = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = response.data;
            setValue('name', userData.name);
            setValue('email', userData.email);
            setValue('role', userData.role);
            setPreviewUrl(userData.photoUrl);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error.response?.data?.message || error.message);
            setError('Failed to load user data');
            toast.error('Failed to load user data');
            setLoading(false);
        }
    };

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
        setError(null);

        const token = localStorage.getItem('token');
        const submissionData = new FormData();

        submissionData.append('name', formData.name);
        submissionData.append('email', formData.email);
        submissionData.append('role', formData.role);

        if (selectedFile) {
            submissionData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/auth/users/${id}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('User updated successfully');
                setLoading(false);
                navigate('/admin/users'); 
            }
        } catch (error) {
            console.error('Error updating user:', error.response?.data?.message || error.message);
            setError('Failed to update user');
            toast.error('Failed to update user');
            setLoading(false);
        }
    };

    if (loading) return <div><Loader message="Updating profile..." /></div>;

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="w-full mt-8 max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
            <h1 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">EDIT USER</h1>
            
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
                        className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                        text-headingColor placeholder:text-textColor cursor-pointer"
                    />
                    {errors.email && <p className="text-red-700">{errors.email.message}</p>}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        {...register('role', {
                            required: 'Role is required',
                        })}
                        className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                        text-headingColor cursor-pointer"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-700">{errors.role.message}</p>}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <div className="mt-4">
                        {previewUrl && (
                            <div className="mb-4" style={{ width: '200px', height: '200px', border: '1px solid #e2e8f0' }}>
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={handleFileInputChange}
                            accept="image/*"
                            className="mt-2 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
                >
                    Update User
                </button>
            </form>
            <Link to="/admin/users" className="text-primaryColor font-medium ml-1">
              Go To Users
            </Link>
        </div>
    );
};

export default EditUser;
