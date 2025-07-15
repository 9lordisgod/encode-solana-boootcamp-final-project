import { PublicKey } from '@solana/web3.js';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
  authority: PublicKey;
  publicKey: PublicKey;
}

export interface CreateItemForm {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface PurchaseItemForm {
  quantity: number;
}

export interface UpdateQuantityForm {
  quantity: number;
}

export interface MarketplaceState {
  items: Item[];
  loading: boolean;
  error: string | null;
} 