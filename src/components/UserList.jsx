// components/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); // Default number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value)); // Update users per page
    setCurrentPage(1); // Reset to the first page
  };

  if (loading) return<div > <Loader/> </div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User List</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Users per page dropdown */}
      <div>
        <label>Users per page: </label>
        <select value={usersPerPage} onChange={handleUsersPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th> {/* Serial number header */}
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{(currentPage - 1) * usersPerPage + index + 1}</td> {/* Serial number */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Link to={`/user-list/${user.id}`}>View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)}>
           Page number : {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
