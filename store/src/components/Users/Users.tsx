import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Users.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface User {
  id: number;
  username: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userData = { username, email };

    if (selectedUser) {
      // Update existing user
      await axios.put(`${API_BASE_URL}/api/users/${selectedUser.id}/`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Create new user
      await axios.post(`${API_BASE_URL}/api/users/`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setUsername('');
    setEmail('');
    setSelectedUser(null);
    fetchUsers(); // Call the fetch function to refresh the list
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/users/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers(); // Refresh the list after deletion
  };

  return (
    <div className={styles.usersContainer}>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">{selectedUser ? 'Update' : 'Create'} User</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
