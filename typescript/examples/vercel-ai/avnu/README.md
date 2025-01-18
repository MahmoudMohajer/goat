# Avnu Example

> ⚠️ **Node.js Version Requirement**: This example requires Node.js version `>=20.12.2 <21`

## Setup

1. Clone the repository (using this fork until merged with main goat repo):
```bash
git clone https://github.com/MahmoudMohajer/goat.git
cd goat
git checkout starknet_demo
cd typescript/examples/vercel-ai/avnu/ # go to the example directory
```

2. Install dependencies:
```bash
pnpm --filter "goat-examples-vercel-ai-avnu" \
     --filter "@goat-sdk/adapter-vercel-ai" \
     --filter "@goat-sdk/core" \
     --filter "@goat-sdk/plugin-avnu" \
     --filter "@goat-sdk/wallet-starknet" \
     --filter "@goat-sdk/plugin-starknet-token" \
     install
```

3. Build the project:
```bash
pnpm --filter "goat-examples-vercel-ai-avnu" \
     --filter "@goat-sdk/adapter-vercel-ai" \
     --filter "@goat-sdk/core" \
     --filter "@goat-sdk/plugin-avnu" \
     --filter "@goat-sdk/wallet-starknet" \
     --filter "@goat-sdk/plugin-starknet-token" \
     build
```

## Configuration

### Environment Variables
The following environment variables are required:

- `BASE_URL` (default provided)
- `STARKNET_RPC` (default provided)
- `PRIVATE_KEY`
- `ACCOUNT_ADDRESS`
- `OPENAI_API_KEY`

> Note: Default values for `BASE_URL` and `STARKNET_RPC` are working, but can be changed if needed.

### Setup Environment File
```bash
cp .env.template .env
# Edit .env file with your values
```

## Running the Example

### Using OpenAI
```bash
npx ts-node src/index.ts
```

### Using Ollama
```bash
npx ts-node src/ollama.ts
```

> **Note**: Ollama is not recommended for this example as it may not perform as well as OpenAI. If using Ollama, suggested models are `qwen2.5-coder:14b` or models with more parameters.

To change the Ollama model:
```javascript
model: ollama("qwen2.5-coder:14b")
```

then you can prompt the agent to do tasks like swap, send, and get balance with prompts like these:
- swap 2 USDC to ETH 
- send 0.01 ETH to 0x1234567890123456789012345678901234567890
- get my wallet address and STRK token address and pass them to the relevant tool to get the balance
