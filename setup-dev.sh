#!/bin/bash

# ACN Node Development Setup Script
echo "🧠 Setting up ACN Node development environment..."

# Install dependencies
echo "📦 Installing dependencies..."

# Frontend dependencies
echo "📱 Setting up Angular frontend..."
cd frontend
npm install
cd ..

# MCP Server dependencies  
echo "🔌 Setting up MCP servers..."
cd mcp-servers/filesystem
npm install
cd ../..

# Test MCP server
echo "🧪 Testing filesystem MCP server..."
cd mcp-servers/filesystem
timeout 5s npm start &
MCP_PID=$!
sleep 2
if kill -0 $MCP_PID 2>/dev/null; then
    echo "✅ Filesystem MCP server started successfully"
    kill $MCP_PID
else
    echo "❌ Filesystem MCP server failed to start"
fi
cd ../..

echo ""
echo "🎯 ACN Node setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start filesystem MCP server: cd mcp-servers/filesystem && npm start"
echo "2. Start Angular frontend: cd frontend && ng serve"
echo "3. Open browser: http://localhost:4200"
echo ""
echo "🔧 Development commands:"
echo "- npm run dev (start all services)"
echo "- npm test (run tests)"
echo "- npm run build (build for production)"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- CONTRIBUTING.md - Development guidelines"
echo ""
echo "🚀 ACN Node is ready for development!"