import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorProvider, web3 } from '@coral-xyz/anchor';
import { Item, CreateItemForm, PurchaseItemForm, UpdateQuantityForm } from '../types/marketplace';
import { getProgram, PROGRAM_ID, formatSol } from '../utils/solana';

export const useMarketplace = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get provider
  const getProvider = useCallback(() => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    return new AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions!,
      },
      { commitment: 'confirmed' }
    );
  }, [connection, wallet]);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = getProvider();
      const program = getProgram(provider);
      
      // Fetch all item accounts
      const itemAccounts = await program.account.item.all();
      
      const fetchedItems: Item[] = itemAccounts.map(account => ({
        id: Number(account.account.id),
        name: account.account.name,
        quantity: Number(account.account.quantity),
        price: Number(account.account.price),
        authority: account.account.authority,
        publicKey: account.publicKey,
      }));
      
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [getProvider]);

  // Create new item
  const createItem = useCallback(async (formData: CreateItemForm) => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = getProvider();
      const program = getProgram(provider);
      
      // Generate a new keypair for the item account
      const itemKeypair = web3.Keypair.generate();
      
      const tx = await program.methods
        .createItem(
          new web3.BN(formData.id),
          formData.name,
          new web3.BN(formData.quantity),
          new web3.BN(formData.price)
        )
        .accounts({
          authority: wallet.publicKey!,
          item: itemKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([itemKeypair])
        .rpc();
      
      console.log('Item created:', tx);
      await fetchItems(); // Refresh the list
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProvider, wallet.publicKey, fetchItems]);

  // Purchase item
  const purchaseItem = useCallback(async (item: Item, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = getProvider();
      const program = getProgram(provider);
      
      const tx = await program.methods
        .purchaseItem(new web3.BN(quantity))
        .accounts({
          item: item.publicKey,
          buyer: wallet.publicKey!,
          itemAuthority: item.authority,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('Item purchased:', tx);
      await fetchItems(); // Refresh the list
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProvider, wallet.publicKey, fetchItems]);

  // Update item quantity
  const updateQuantity = useCallback(async (item: Item, newQuantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = getProvider();
      const program = getProgram(provider);
      
      const tx = await program.methods
        .updateQuantity(new web3.BN(newQuantity))
        .accounts({
          item: item.publicKey,
          authority: wallet.publicKey!,
        })
        .rpc();
      
      console.log('Quantity updated:', tx);
      await fetchItems(); // Refresh the list
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProvider, wallet.publicKey, fetchItems]);

  // Delete item
  const deleteItem = useCallback(async (item: Item) => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = getProvider();
      const program = getProgram(provider);
      
      const tx = await program.methods
        .deleteItem()
        .accounts({
          item: item.publicKey,
          authority: wallet.publicKey!,
        })
        .rpc();
      
      console.log('Item deleted:', tx);
      await fetchItems(); // Refresh the list
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProvider, wallet.publicKey, fetchItems]);

  // Load items on mount
  useEffect(() => {
    if (wallet.connected) {
      fetchItems();
    }
  }, [wallet.connected, fetchItems]);

  return {
    items,
    loading,
    error,
    createItem,
    purchaseItem,
    updateQuantity,
    deleteItem,
    fetchItems,
  };
}; 