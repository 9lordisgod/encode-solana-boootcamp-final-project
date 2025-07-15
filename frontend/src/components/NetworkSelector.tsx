import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../utils/cn';

interface NetworkSelectorProps {
  network: WalletAdapterNetwork;
  onNetworkChange: (network: WalletAdapterNetwork) => void;
  isConnected: boolean;
}

const networks = [
  { value: WalletAdapterNetwork.Devnet, label: 'Devnet', color: 'text-yellow-600' },
  { value: WalletAdapterNetwork.Testnet, label: 'Testnet', color: 'text-blue-600' },
  { value: WalletAdapterNetwork.Mainnet, label: 'Mainnet', color: 'text-green-600' },
];

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  network,
  onNetworkChange,
  isConnected,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentNetwork = networks.find(n => n.value === network);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500",
          "transition-colors duration-200"
        )}
      >
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {currentNetwork?.label}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {networks.map((net) => (
              <button
                key={net.value}
                onClick={() => {
                  onNetworkChange(net.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                  "transition-colors duration-200",
                  network === net.value && "bg-primary-50 text-primary-700"
                )}
              >
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", net.color)} />
                  <span>{net.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 