import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { SolanaMarketplace } from '../../../target/types/solana_marketplace';
import idl from '../../../target/idl/solana_marketplace.json';

// Program ID from your Anchor.toml
export const PROGRAM_ID = new PublicKey("3sPVHWRvyqEoPHYMsEK34fexKXLeqiPtbDXGFyeTFF6L");

// Network configuration
export const NETWORK = clusterApiUrl('devnet'); // Change to 'mainnet-beta' for production

// Connection to Solana network
export const connection = new Connection(NETWORK, 'confirmed');

// Initialize the program
export const getProgram = (provider: AnchorProvider): Program<SolanaMarketplace> => {
  return new Program(idl as any, PROGRAM_ID, provider);
};

// Convert lamports to SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / 1e9;
};

// Convert SOL to lamports
export const solToLamports = (sol: number): number => {
  return sol * 1e9;
};

// Format SOL amount for display
export const formatSol = (lamports: number): string => {
  return `${lamportsToSol(lamports).toFixed(4)} SOL`;
}; 