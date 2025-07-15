#!/bin/bash

echo "🚀 Setting up Solana Marketplace Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

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

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your Solana program is built: anchor build"
echo "2. Deploy your program: anchor deploy"
echo "3. Start the frontend: npm start"
echo "4. Open http://localhost:3000 in your browser"
echo "5. Connect your Solana wallet and start trading!"
echo ""
echo "For more information, see README.md" 