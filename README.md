# Solana Marketplace

A decentralized e-commerce platform built on the Solana blockchain. This project includes a Solana Anchor smart contract and a modern React frontend with enhanced wallet support, inspired by the Solana Starter Kit.

## Overview

Solana Marketplace allows users to:
- Create and manage inventory items
- Purchase items using SOL
- Update and delete items (for item owners)
- Connect with multiple Solana wallets (Phantom, Solflare, Backpack, Coinbase, Glow, Slope, Trust, WalletConnect)
- Switch between Devnet, Testnet, and Mainnet
- Track transaction status with direct links to Solana Explorer

## Features

- 🛍️ Marketplace operations: create, purchase, update, delete items
- 🔗 Multi-wallet support (Phantom, Solflare, Backpack, Coinbase, Glow, Slope, Trust, WalletConnect)
- 🌐 Network selector (Devnet, Testnet, Mainnet)
- ⚡ Real-time updates and transaction feedback
- 🎨 Modern, mobile-responsive UI with Tailwind CSS
- 🔒 Secure transaction signing and error handling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Solana CLI tools
- Anchor CLI
- A Solana wallet (Phantom, Solflare, etc.)

## Getting Started

### 1. Clone the Repository

git clone https://github.com/9lordisgod/encode-solana-boootcamp-final-project.git
cd encode-solana-boootcamp-final-project

### 2. Install Dependencies

cd frontend
./install.sh

Or manually:
npm install

### 3. Build and Deploy the Program

cd ..
anchor build
anchor deploy

### 4. Start the Frontend

cd frontend
npm start

Open http://localhost:3000 in your browser.

## Usage

- **Connect your wallet** using the Connect Wallet button
- **Switch networks** using the network selector (Devnet recommended for testing)
- **Create items** as a store owner
- **Purchase items** as a buyer
- **Update or delete items** if you are the item owner
- **Track transaction status** with real-time feedback and explorer links

## Configuration

- **Program ID**: Set in \ (should match your deployed program)
- **Network**: Default is Devnet, can be changed in the UI
- **WalletConnect**: Add your project ID in \ if needed

## Project Structure

app/                  # Program client utilities
frontend/             # React frontend
    src/
        components/   # UI components
        hooks/        # Custom React hooks
        types/        # TypeScript types
        utils/        # Utility functions
        ...
    public/
    ...
migrations/           # Anchor migrations
programs/             # Solana Anchor program
tests/                # Program tests
Anchor.toml           # Anchor config
Cargo.toml            # Rust config
README.md             # Project documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

---

**Inspired by the [Solana Starter Kit](https://github.com/Primitives-xyz/solana-starter-kit)**
