import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import styles from './Sales.module.css';

interface Sale {
  id: number;
  product: string; // Use product name instead of ID
  amount: number;
  customer: string; // Use customer name instead of ID
  user: string; // Use user name instead of ID
}

interface Stock {
  id: number;
  product_name: string; // Name of the product
  amount: number;
}

interface Customer {
  id: number;
  name: string; // Name of the customer
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [product, setProduct] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [customer, setCustomer] = useState<number | null>(null);
  const userId = Number(localStorage.getItem('userId')); // Assuming user ID is stored in localStorage

  // Fetch sales, stock, and customer data
  useEffect(() => {
    const fetchSalesAndStock = async () => {
      const token = localStorage.getItem('token');

      try {
        const [salesResponse, stockResponse, customerResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/sales/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/stocks/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/customers/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Log the responses to see their structure
        console.log('Sales Response:', salesResponse.data);
        console.log('Stock Response:', stockResponse.data);
        console.log('Customer Response:', customerResponse.data);

        setSales(salesResponse.data);
        setStocks(stockResponse.data);
        setCustomers(customerResponse.data);
      } catch (error) {
        console.error('Failed to fetch sales, stock, or customers:', error);
      }
    };

    fetchSalesAndStock();
  }, []);

  // Handle form submission to register a new sale
  const handleSale = async () => {
    if (!product || !customer) {
      alert('Please select a product and a customer.');
      return;
    }

    const stockItem = stocks.find(stock => stock.id === product);

    if (!stockItem) {
      alert('Product not found in stock.');
      return;
    }

    if (stockItem.amount < amount) {
      alert('Not enough stock available.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      // Register the sale
      await axios.post(
        `${API_BASE_URL}/api/sales/`,
        { 
          product: product, 
          amount, 
          customer: customer,
          user: userId // Include user ID
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the stock by subtracting the sold quantity
      await axios.put(
        `${API_BASE_URL}/api/stock/${stockItem.id}/`,
        { ...stockItem, amount: stockItem.amount - amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Sale registered successfully!');
      setAmount(0); // Reset quantity input
      setProduct(null); // Reset product selection
      setCustomer(null); // Reset customer selection
    } catch (error) {
      console.error('Error registering sale:', error);
      alert('Failed to register sale.');
    }
  };

  return (
    <div className={styles.salesContainer}>
      <h1>Sales</h1>

      <div className={styles.form}>
        <select
          value={product || ''}
          onChange={e => setProduct(Number(e.target.value))}
        >
          <option value="" disabled>
            Select a product
          </option>
          {stocks.map(stock => (
            <option key={stock.id} value={stock.id}>
              {stock.product_name} (Available: {stock.amount})
            </option>
          ))}
        </select>

        <select
          value={customer || ''}
          onChange={e => setCustomer(Number(e.target.value))}
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />

        <button onClick={handleSale}>Register Sale</button>
      </div>

      <h2>Sales History</h2>
      <ul>
        {sales.map(sale => (
          <li key={sale.id}>
            Product: {sale.product} - Quantity: {sale.amount} - Customer: {sale.customer} - User: {sale.user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
