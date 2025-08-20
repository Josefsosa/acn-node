# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two main components:

1. **NLE Proxy Server** - A Node.js/Express proxy server for AI provider APIs (Anthropic Claude and OpenAI)
2. **NLE v1.2 Minimalist IDE** - A browser-based IDE with AI integration (HTML file located at `src/nle_v_2.html`)

## Development Commands

```bash
# Install dependencies
npm install

# Run the proxy server in development mode with TypeScript
npm run dev

# Run server AND open NLE dashboard in browser (development mode)
npm run deve

# Build TypeScript to JavaScript
npm run build

# Run the production server (after building)
npm start
```

## Architecture

### Proxy Server (`src/server.ts`)
- **Purpose**: Provides CORS-enabled proxy endpoints for AI API calls from the browser
- **Port**: 8787 (configurable via `PORT` environment variable)
- **API Endpoints**:
  - `GET /health` - Health check and provider key status
  - `POST /anthropic/messages` - Proxy for Claude API
  - `POST /openai/chat/completions` - Proxy for OpenAI API
- **Security**: Implements rate limiting (60 requests/minute), CORS with allowlist, request validation with Zod schemas
- **Required Environment Variables**:
  - `ANTHROPIC_API_KEY` - For Claude API access
  - `OPENAI_API_KEY` - For OpenAI API access
  - `ALLOW_ORIGINS` - Comma-separated list of allowed origins (default: *)
  - `PORT` - Server port (default: 8787)

### Browser IDE (`src/nle_v_2.html`)
- **Architecture**: Self-contained HTML file with embedded JavaScript and CSS
- **Key Components**:
  - File tree browser
  - Multi-tab editor with iframe/text rendering
  - Terminal emulator
  - Command input with Oakland CLI support
  - Provider selection (RAM-BAI, Claude, ChatGPT, Google)
- **Features**:
  - BM25 search indexing
  - Natural language command processing
  - API key management via localStorage
  - Proxy URL configuration for CORS bypass

## Key Patterns

- The HTML file is a standalone application - no build process required for frontend changes
- The proxy server uses TypeScript with minimal strict checking (`strict: false` in tsconfig)
- Environment variables are loaded via `dotenv` package
- CORS is handled at the proxy level to enable browser-based API calls
- Request validation uses Zod schemas for type safety