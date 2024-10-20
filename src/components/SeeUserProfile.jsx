import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SeeUserProfile = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams(); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                console.log(response.data, '56555')
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error.response?.data?.message || error.message);
            }
        };

        fetchUser();
    }, [id]);



    

    return (
        <>
            <div>
                <label>Name</label>
                <p>{user?.name}</p>
            </div>
            <div>
                <label>Email</label>
                <p> {user?.email} </p>
            </div>
            <div>
                <img src={user?.photoUrl} alt='profile_picture'/> 
      
            </div>
            </>
    );
};

export default SeeUserProfile;
