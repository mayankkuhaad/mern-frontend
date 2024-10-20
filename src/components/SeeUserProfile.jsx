import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SeeUserProfile = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams(); 
    const [previewUrl, setPreviewUrl] = useState(''); 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setUser(response.data);
                setPreviewUrl(response.data.photoUrl); 
            } catch (error) {
                console.error('Error fetching user:', error.response?.data?.message || error.message);
            }
        };

        fetchUser();
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-full mt-8 max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
            <h1 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">Profile</h1>
            
            <div className="mb-5">
                <label className="block mb-2 font-semibold">Name:</label>
                <p className="text-[16px] leading-7 text-headingColor">{user.name}</p>
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold">Email:</label>
                <p className="text-[16px] leading-7 text-headingColor">{user.email}</p>
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold">Role:</label>
                <p className="text-[16px] leading-7 text-headingColor">{user.role}</p>
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold">Verified:</label>
                <p className="text-[16px] leading-7 text-headingColor">{user.isVerified ? 'Yes' : 'No'}</p>
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold">Profile Picture:</label>
                <div className="mt-4">
                    {previewUrl ? (
                        <div style={{ width: '200px', height: '200px' }}>
                            <img 
                                src={previewUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-full" 
                            />
                        </div>
                    ) : (
                        <p>No profile picture available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeeUserProfile;