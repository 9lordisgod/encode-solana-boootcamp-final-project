#!/bin/bash

echo "🚀 Installing Solana Marketplace Frontend with Enhanced Wallet Features..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "⚠️  Anchor CLI is not installed. Please install it with:"
    echo "   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    echo ""
    echo "   Then run: anchor --version"
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "⚠️  Solana CLI is not installed. Please install it with:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    echo ""
    echo "   Then run: solana --version"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Enhanced Features Available:"
echo "✅ Multiple wallet support (Phantom, Solflare, Backpack, Coinbase, etc.)"
echo "✅ Network switching (Devnet, Testnet, Mainnet)"
echo "✅ Transaction status tracking"
echo "✅ Copy wallet address functionality"
echo "✅ Mobile responsive design"
echo ""
echo "Next steps:"
echo "1. Make sure your Solana program is built: anchor build"
echo "2. Deploy your program: anchor deploy"
echo "3. Start the frontend: npm start"
echo "4. Open http://localhost:3000 in your browser"
echo "5. Connect your Solana wallet and start trading!"
echo ""
echo "For more information, see README.md" 