import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Warehouses.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(0);

  const fetchWarehouses = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/warehouses/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWarehouses(response.data);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const warehouseData = { name, location, capacity };

    if (selectedWarehouse) {
      // Update existing warehouse
      await axios.put(`${API_BASE_URL}/api/warehouses/${selectedWarehouse.id}/`, warehouseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Create new warehouse
      await axios.post(`${API_BASE_URL}/api/warehouses/`, warehouseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setName('');
    setLocation('');
    setCapacity(0);
    setSelectedWarehouse(null);
    fetchWarehouses(); // Call the fetch function to refresh the list
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setName(warehouse.name);
    setLocation(warehouse.location);
    setCapacity(warehouse.capacity);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/warehouses/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWarehouses(); // Refresh the list after deletion
  };

  return (
    <div className={styles.warehouseContainer}>
      <h1>Warehouses</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Warehouse Name"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Warehouse Location"
          required
        />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          placeholder="Warehouse Capacity"
          required
        />
        <button type="submit">{selectedWarehouse ? 'Update' : 'Create'} Warehouse</button>
      </form>
      <ul>
        {warehouses.map((warehouse) => (
          <li key={warehouse.id}>
            {warehouse.name} - {warehouse.location} - Capacity: {warehouse.capacity}
            <button onClick={() => handleEdit(warehouse)}>Edit</button>
            <button onClick={() => handleDelete(warehouse.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Warehouses;
