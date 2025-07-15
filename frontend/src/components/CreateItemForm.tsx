import React, { useState } from 'react';
import { CreateItemForm as CreateItemFormType } from '../types/marketplace';
import { solToLamports } from '../utils/solana';
import { Plus } from 'lucide-react';

interface CreateItemFormProps {
  onSubmit: (formData: CreateItemFormType) => Promise<void>;
  loading: boolean;
}

export const CreateItemForm: React.FC<CreateItemFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateItemFormType>({
    id: 0,
    name: '',
    quantity: 0,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.quantity <= 0 || formData.price <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        price: solToLamports(formData.price), // Convert SOL to lamports
      });
      
      // Reset form
      setFormData({
        id: 0,
        name: '',
        quantity: 0,
        price: 0,
      });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item ID
            </label>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter unique item ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (SOL)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter price in SOL"
              min="0.001"
              step="0.001"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'Creating...' : 'Create Item'}</span>
        </button>
      </form>
    </div>
  );
}; 