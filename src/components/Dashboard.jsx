import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {serverUrl} from '../index'
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${serverUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <div className="max-w-[1170px] px-5 mx-auto">
      <div className='mt-8 flex items-end'>
      <h1 className="text-[28px] leading-9 font-bold mb-10 text-headingColor w-full" >User Dashboard</h1>

      <div className='flex '>
            <div className="mt-8">
            <Link to="/profile">
                  <button
                    className="w-40 ml-8 px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
                  >
                  My profile
                  </button>
                  </Link> 
                </div>
            <div >
            <Link to="/user-list">
            <button className="w-40 mt-8 ml-8 px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg">
                  See Users
            </button>

            </Link> 
            </div>
      </div>
      </div>
      <div>
      <h2 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">Welcome, {userData?.user.name}</h2>
      </div>
      <div style={{ textAlign: "right"}}>
      <p>Email: {userData?.user.email}</p>
      <p>Role: {userData?.user.role}</p>
      </div>
      <div style={{width:"20rem", border:"1px solid"}}>
        <img src={userData?.user?.photoUrl} alt="" />
      </div>
     


    </div>
    </>
  );
};

export default Dashboard;
