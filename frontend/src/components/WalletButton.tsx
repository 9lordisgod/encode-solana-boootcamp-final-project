import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export const WalletButton: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {connected && publicKey && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Wallet className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      )}
      <WalletMultiButton 
        className={cn(
          "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md",
          "font-medium transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        )}
      />
    </div>
  );
}; 