import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Products.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  warehouse: number; // Assuming you'll pass warehouse ID
}

interface Warehouse {
  id: number;
  name: string; // Assuming warehouse has a name field
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // New state for warehouses
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [warehouse, setWarehouse] = useState(0); // Warehouse ID

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
    fetchProducts();
    fetchWarehouses(); // Fetch warehouses
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const productData = { name, description, price, warehouse };

    if (selectedProduct) {
      // Update existing product
      await axios.put(`${API_BASE_URL}/api/products/${selectedProduct.id}/`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Create new product
      await axios.post(`${API_BASE_URL}/api/products/`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // Reset form fields
    setName('');
    setDescription('');
    setPrice(0);
    setWarehouse(0);
    setSelectedProduct(null);
    fetchProducts(); // Refresh the list
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setWarehouse(product.warehouse); // Set selected warehouse
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/products/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts(); // Refresh the list after deletion
  };

  return (
    <div className={styles.productContainer}>
      <h1>Products</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Product Price"
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
        <button type="submit">{selectedProduct ? 'Update' : 'Create'} Product</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.description} - Price: {product.price} - Warehouse ID: {product.warehouse}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
