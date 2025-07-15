import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletButton } from './components/WalletButton';
import { NetworkSelector } from './components/NetworkSelector';
import { CreateItemForm } from './components/CreateItemForm';
import { ItemCard } from './components/ItemCard';
import { useMarketplace } from './hooks/useMarketplace';
import { CreateItemForm as CreateItemFormType } from './types/marketplace';
import { RefreshCw, Package, ShoppingBag, AlertCircle } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  const { connected } = useWallet();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
  const {
    items,
    loading,
    error,
    createItem,
    purchaseItem,
    updateQuantity,
    deleteItem,
    fetchItems,
  } = useMarketplace();

  const handleCreateItem = async (formData: CreateItemFormType) => {
    try {
      await createItem(formData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const handleNetworkChange = (newNetwork: WalletAdapterNetwork) => {
    setNetwork(newNetwork);
    // You might want to reconnect the wallet or update the connection here
    console.log('Network changed to:', newNetwork);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <Package className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solana Marketplace</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to start trading</p>
            
            {/* Network Selector */}
            <div className="mb-6">
              <NetworkSelector
                network={network}
                onNetworkChange={handleNetworkChange}
                isConnected={connected}
              />
            </div>
            
            <WalletButton />
          </div>
          
          {/* Network Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Network: {network}</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Make sure your wallet is connected to the same network
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Solana Marketplace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NetworkSelector
                network={network}
                onNetworkChange={handleNetworkChange}
                isConnected={connected}
              />
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Connected to {network}</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Ensure your wallet and this app are on the same network
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors duration-200",
                "flex items-center space-x-2",
                showCreateForm
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              )}
            >
              <Package className="w-4 h-4" />
              <span>{showCreateForm ? 'Cancel' : 'Create Item'}</span>
            </button>
            <button
              onClick={fetchItems}
              disabled={loading}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors duration-200",
                "flex items-center space-x-2",
                "bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span>Refresh</span>
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {items.length} item{items.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Create Item Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateItemForm onSubmit={handleCreateItem} loading={loading} />
          </div>
        )}

        {/* Items Grid */}
        {loading && items.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
            <p className="text-gray-600">Create the first item to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.publicKey.toString()}
                item={item}
                onPurchase={purchaseItem}
                onUpdateQuantity={updateQuantity}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 