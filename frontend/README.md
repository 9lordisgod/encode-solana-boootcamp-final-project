# Solana Marketplace Frontend

A modern React frontend for the Solana marketplace program, built with TypeScript, Tailwind CSS, and enhanced Solana wallet integration inspired by the [Solana Starter Kit](https://github.com/Primitives-xyz/solana-starter-kit).

## Features

- 🔗 **Enhanced Wallet Integration**: Support for Phantom, Solflare, Backpack, Coinbase, Glow, Slope, Trust, and WalletConnect
- 🌐 **Network Switching**: Easily switch between Devnet, Testnet, and Mainnet
- 🛍️ **Marketplace Operations**: Create, purchase, update, and delete items
- 💰 **SOL Transactions**: Handle SOL payments for item purchases
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time Updates**: Automatic refresh of marketplace data
- 🔒 **Security**: Proper transaction signing and error handling
- 📊 **Transaction Status**: Real-time transaction feedback with explorer links
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Supported Wallets

- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich Solana wallet
- **Backpack** - Modern Solana wallet
- **Coinbase Wallet** - Coinbase's Solana wallet
- **Glow** - Mobile-first Solana wallet
- **Slope** - Cross-platform Solana wallet
- **Trust Wallet** - Multi-chain wallet with Solana support
- **WalletConnect** - Connect any wallet via QR code
- **Unsafe Burner** - Development wallet (dev only)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Solana CLI tools
- A Solana wallet (Phantom, Solflare, etc.)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Build the Anchor program (if not already built):
```bash
cd ..
anchor build
```

## Development

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Connect your Solana wallet to interact with the marketplace

## Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button
2. Select your preferred wallet from the dropdown
3. Approve the connection in your wallet
4. Your wallet address will be displayed with a copy button

### Network Selection

1. Use the network selector in the header to switch between:
   - **Devnet** (default) - For testing
   - **Testnet** - For testing on testnet
   - **Mainnet** - For production

2. Ensure your wallet is connected to the same network

### Creating Items

1. Click "Create Item" button
2. Fill in the form:
   - **Item ID**: Unique identifier for the item
   - **Item Name**: Display name for the item
   - **Quantity**: Initial stock quantity
   - **Price**: Price in SOL
3. Click "Create Item" to submit the transaction
4. Monitor transaction status in real-time

### Purchasing Items

1. Browse available items in the marketplace
2. Select the quantity you want to purchase
3. Click "Purchase" to complete the transaction
4. Confirm the transaction in your wallet
5. View transaction status and explorer link

### Managing Your Items

If you're the owner of an item, you can:
- **Edit Quantity**: Update the stock quantity
- **Delete Item**: Remove the item from the marketplace

## Configuration

### Network Configuration

The app supports multiple networks:

- **Devnet**: `clusterApiUrl('devnet')` - Default for development
- **Testnet**: `clusterApiUrl('testnet')` - For testing
- **Mainnet**: `clusterApiUrl('mainnet-beta')` - For production

### Program ID

The program ID is configured in `src/utils/solana.ts`. Make sure it matches your deployed program.

### WalletConnect Configuration

To use WalletConnect, add your project ID in `src/components/WalletProvider.tsx`:

```typescript
new WalletConnectWalletAdapter({
  network,
  options: {
    projectId: 'your-project-id', // Get from https://cloud.walletconnect.com/
  },
}),
```

## Building for Production

1. Build the production version:
```bash
npm run build
```

2. The built files will be in the `build` directory

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Make sure you have a Solana wallet installed
   - Try refreshing the page and reconnecting
   - Check if your wallet supports the selected network

2. **Transaction Failed**
   - Check your SOL balance
   - Ensure you're on the correct network
   - Check the browser console for error details
   - Verify the program is deployed to the correct network

3. **Items Not Loading**
   - Verify the program is deployed
   - Check the network connection
   - Ensure the program ID is correct
   - Make sure you're on the right network

4. **Network Mismatch**
   - Use the network selector to match your wallet's network
   - Disconnect and reconnect your wallet after changing networks

### Getting SOL for Testing

For devnet testing, you can get SOL from a faucet:
```bash
solana airdrop 2 <your-wallet-address> --url devnet
```

For testnet:
```bash
solana airdrop 2 <your-wallet-address> --url testnet
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CreateItemForm.tsx
│   │   ├── ItemCard.tsx
│   │   ├── NetworkSelector.tsx
│   │   ├── TransactionStatus.tsx
│   │   ├── WalletButton.tsx
│   │   └── WalletProvider.tsx
│   ├── hooks/
│   │   └── useMarketplace.ts
│   ├── types/
│   │   └── marketplace.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── solana.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Enhanced Features

### Transaction Status Tracking
- Real-time transaction status updates
- Direct links to Solana Explorer
- Success/error feedback with detailed messages

### Network Management
- Easy network switching
- Network status indicators
- Automatic wallet network detection

### Wallet Features
- Copy wallet address functionality
- Multiple wallet support
- Wallet connection status
- Transaction history tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 