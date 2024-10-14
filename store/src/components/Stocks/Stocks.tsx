import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Stocks.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface Product {
  id: number;
  name: string; // Assuming Product has a name field
}

interface Warehouse {
  id: number;
  name: string; // Assuming Warehouse has a name field
}

interface Stock {
  id: number;
  product: Product; // Now it holds the full product object
  amount: number;
  warehouse: number; // Warehouse ID
}

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // New state for warehouses
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [product, setProduct] = useState(0); // Product ID
  const [amount, setAmount] = useState(0);
  const [warehouse, setWarehouse] = useState(0); // Warehouse ID

  const fetchStocks = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/stocks/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStocks(response.data);
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(response.data);
  };

  const fetchWarehouses = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/warehouses/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWarehouses(response.data);
  };

  useEffect(() => {
    fetchStocks();
    fetchProducts(); // Fetch products to use their names
    fetchWarehouses(); // Fetch warehouses to use their names
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const stockData = { product, amount, warehouse };

    if (selectedStock) {
      // Update existing stock
      await axios.put(`${API_BASE_URL}/api/stocks/${selectedStock.id}/`, stockData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Create new stock
      await axios.post(`${API_BASE_URL}/api/stocks/`, stockData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // Reset form fields
    setProduct(0);
    setAmount(0);
    setWarehouse(0);
    setSelectedStock(null);
    fetchStocks(); // Call the fetch function to refresh the list
  };

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setProduct(stock.product.id); // Set selected product ID
    setAmount(stock.amount);
    setWarehouse(stock.warehouse); // Set selected warehouse
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/stocks/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchStocks(); // Refresh the list after deletion
  };

  return (
    <div className={styles.stockContainer}>
      <h1>Stocks</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={product}
          onChange={(e) => setProduct(Number(e.target.value))}
          required
        >
          <option value={0}>Select Product</option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.name} {/* Display product name */}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Stock Amount"
          required
        />
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(Number(e.target.value))}
          required
        >
          <option value={0}>Select Warehouse</option>
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {wh.name} {/* Display warehouse name */}
            </option>
          ))}
        </select>
        <button type="submit">{selectedStock ? 'Update' : 'Create'} Stock</button>
      </form>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.id}>
            Product: {stock.product.name} - Amount: {stock.amount} - Warehouse ID: {stock.warehouse}
            <button onClick={() => handleEdit(stock)}>Edit</button>
            <button onClick={() => handleDelete(stock.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stocks;
