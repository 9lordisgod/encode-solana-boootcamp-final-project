import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Item } from '../types/marketplace';
import { formatSol } from '../utils/solana';
import { ShoppingCart, Edit, Trash2, Plus, Minus } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onPurchase: (item: Item, quantity: number) => Promise<void>;
  onUpdateQuantity: (item: Item, quantity: number) => Promise<void>;
  onDelete: (item: Item) => Promise<void>;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPurchase,
  onUpdateQuantity,
  onDelete,
}) => {
  const { publicKey } = useWallet();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [newQuantity, setNewQuantity] = useState(item.quantity);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwner = publicKey?.equals(item.authority);

  const handlePurchase = async () => {
    if (purchaseQuantity <= 0 || purchaseQuantity > item.quantity) {
      alert('Invalid quantity');
      return;
    }

    setLoading(true);
    try {
      await onPurchase(item, purchaseQuantity);
      setPurchaseQuantity(1);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async () => {
    if (newQuantity < 0) {
      alert('Quantity cannot be negative');
      return;
    }

    setLoading(true);
    try {
      await onUpdateQuantity(item, newQuantity);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(item);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">ID: {item.id}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">{formatSol(item.price)}</p>
          <p className="text-sm text-gray-500">
            {item.quantity} in stock
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Purchase Section */}
        {!isOwner && item.quantity > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                  className="px-2 py-1 hover:bg-gray-100"
                  disabled={purchaseQuantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                  className="w-16 text-center border-none focus:ring-0"
                />
                <button
                  onClick={() => setPurchaseQuantity(Math.min(item.quantity, purchaseQuantity + 1))}
                  className="px-2 py-1 hover:bg-gray-100"
                  disabled={purchaseQuantity >= item.quantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handlePurchase}
              disabled={loading || item.quantity === 0}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Purchase for {formatSol(item.price * purchaseQuantity)}</span>
            </button>
          </div>
        )}

        {/* Owner Controls */}
        {isOwner && (
          <div className="border-t pt-4 space-y-3">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">New Quantity:</label>
                  <input
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded-md"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateQuantity}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewQuantity(item.quantity);
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Quantity</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 