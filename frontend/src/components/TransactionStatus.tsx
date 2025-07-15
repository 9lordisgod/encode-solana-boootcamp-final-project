import React from 'react';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

export type TransactionStatus = 'pending' | 'success' | 'error';

interface TransactionStatusProps {
  status: TransactionStatus;
  message: string;
  signature?: string;
  onClose?: () => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  message,
  signature,
  onClose,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getExplorerUrl = () => {
    if (!signature) return null;
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  return (
    <div className={cn(
      "p-4 border rounded-lg",
      getStatusColor()
    )}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {signature && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded">
                {signature.slice(0, 8)}...{signature.slice(-8)}
              </span>
              {getExplorerUrl() && (
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline flex items-center space-x-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 