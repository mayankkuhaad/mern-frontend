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
  const [usersPerPage, setUsersPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = response.data?.users;
        if (Array.isArray(usersData)) {
          setUsers(usersData);
          setFilteredUsers(usersData);
        } else {
          throw new Error('Unexpected response format from server');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
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

  const currentUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) return <div><Loader /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="font-semibold text-gray-700">User Accounts</h2>
          <span className="text-xs text-gray-500">View accounts of registered users</span>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      
      <div>
        <label>Users per page: </label>
        <select value={usersPerPage} onChange={handleUsersPerPageChange} className="ml-2 mb-4 p-2 border rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="overflow-y-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3">Photo</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {currentUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-200 bg-white">
                  <td className="px-5 py-5 text-sm">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-5 py-5 text-sm">{user.name}</td>
                  <td className="px-5 py-5 text-sm">{user.email}</td>
                  <td className="px-5 py-5 text-sm">{user.role}</td>
                  <td className="px-5 py-5 text-sm">
                    {user.isVerified ? 'Yes' : 'No'}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <img
                      src={user.photoUrl}
                      alt="User Photo"
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <Link to={`/user-list/${user.id}`} className="text-blue-600 hover:underline">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
          <span className="text-xs text-gray-600 sm:text-sm">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} Entries
          </span>
          <div className="mt-2 inline-flex sm:mt-0">
            <button 
              className="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <button 
              className="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100"
              onClick={() => currentPage < pageNumbers.length && setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;