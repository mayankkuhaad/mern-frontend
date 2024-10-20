import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const UserProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        photoUrl: '',
    });
    const [selectedFile, setSelectedFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setPreviewUrl(response.data.user.photoUrl); 
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setUser({
            ...user, 
            user: { 
                ...user.user, 
                [e.target.name]: e.target.value 
            }
        });
    };
    

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);

            const previewURL = URL.createObjectURL(file);
            setPreviewUrl(previewURL);
        }
    };
    const logFormData = (formData) => {
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
    
        const formData = new FormData();
        formData.append('name', user.user.name);
        formData.append('email', user.user.email);
    
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }
    
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            toast.success(data.message);
            setLoading(false);

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full mt-8 max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
            <form className="py-4 md:py-0" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.user.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                        text-headingColor placeholder:text-textColor cursor-pointer"
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.user.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-b border-solid border-[#0066ff61]
                        focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                        text-headingColor placeholder:text-textColor cursor-pointer"
                    />
                </div>

                {/* Profile Picture Section */}
                <div className="mb-5">
                    <label>Profile Picture</label>
                    <div className="mt-4">
                        {previewUrl && (
                            <div className="mb-4" style={{ width: '200px', height: '200px', border: '1px solid' }}>
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
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
