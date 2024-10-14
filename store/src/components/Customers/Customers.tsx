import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Customers.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface Customer {
  id: number;
  name: string;
  email: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchCustomers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/customers/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCustomers(response.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const customerData = { name, email };

    if (selectedCustomer) {
      // Update existing customer
      await axios.put(`${API_BASE_URL}/api/customers/${selectedCustomer.id}/`, customerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Create new customer
      await axios.post(`${API_BASE_URL}/api/customers/`, customerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setName('');
    setEmail('');
    setSelectedCustomer(null);
    fetchCustomers(); // Call the fetch function to refresh the list
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/customers/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCustomers(); // Refresh the list after deletion
  };

  return (
    <div className={styles.customersContainer}>
      <h1>Customers</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">{selectedCustomer ? 'Update' : 'Create'} Customer</button>
      </form>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.email}
            <button onClick={() => handleEdit(customer)}>Edit</button>
            <button onClick={() => handleDelete(customer.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
