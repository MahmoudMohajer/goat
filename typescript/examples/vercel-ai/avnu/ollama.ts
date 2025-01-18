import readline from "node:readline";
import { generateText } from "ai";
import { ollama } from "ollama-ai-provider";
import { Account, RpcProvider } from "starknet";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { Avnu } from "@goat-sdk/plugin-avnu";
import { STARKNET_TOKENS, starknetToken } from "@goat-sdk/plugin-starknet-token";
import { starknet } from "@goat-sdk/wallet-starknet";

require("dotenv").config();

const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC });
const account = new Account(provider, process.env.ACCOUNT_ADDRESS as string, process.env.PRIVATE_KEY as string);
const wallet = starknet({ starknetAccount: account, starknetClient: provider });

const SWAP_ASSISTANT_PROMPT = `

User request: `;

(async () => {
    const tools = await getOnChainTools({
        wallet: wallet,
        plugins: [Avnu(), starknetToken({ tokens: STARKNET_TOKENS })],
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        let prompt = await new Promise<string>((resolve) => {
            rl.question('Enter your prompt (or "exit" to quit): ', resolve);
        });

        prompt = SWAP_ASSISTANT_PROMPT + prompt;

        if (prompt === "exit") {
            rl.close();
            break;
        }
        console.log(prompt);
        console.log("\n-------------------\n");
        console.log("TOOLS CALLED");
        console.log("\n-------------------\n");

        console.log("\n-------------------\n");
        console.log("RESPONSE");
        console.log("\n-------------------\n");
        try {
            const result = await generateText({
                model: ollama("qwen2.5-coder:14b"),
                tools: tools,
                maxSteps: 15,
                prompt: prompt,
                onStepFinish: (event) => {
                    console.log(event.toolResults);
                },
            });
            console.log(result.text);
        } catch (error) {
            console.error(error);
        }
        console.log("\n-------------------\n");
    }
})();
