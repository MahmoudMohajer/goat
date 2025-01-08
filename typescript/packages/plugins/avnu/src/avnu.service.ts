import { Tool } from "@goat-sdk/core";
import { Account, RpcProvider } from "starknet";
import { executeSwap, fetchQuotes, type Quote } from "@avnu/avnu-sdk";
import { GetQuoteConfigParams } from "./parameters";

export class AvnuService {
    private params;
    account: Account;
    avnu_options;

    constructor() {
        this.params = this.createProviderConfig();
        const provider = new RpcProvider({
            nodeUrl: this.params.Starknet_rpc
        });
        this.avnu_options = {
            baseUrl: this.params.base_url
        };
        this.account = new Account(
            provider,
            this.params.account_address,
            this.params.private_key
        );
    }

    @Tool({
        name: "getQuote",
        description: "Get quotes for swapping tokens on Avnu"
    })
    async getQuote(params: GetQuoteConfigParams): Promise<Quote[]> {
        try {
            const quotes = await fetchQuotes({
                ...params,
                sellAmount: BigInt(params.sellAmount),
                ...this.avnu_options
            });

            if (!quotes || quotes.length === 0) {
                throw new Error("No quotes found");
            }

            return quotes;
        } catch (error) {
            console.error("Error fetching quotes:", error);
            throw error;
        }
    }

    @Tool({
        name: "executeSwap",
        description: "Execute a token swap on Avnu using a quote"
    })
    async Swap(quote: Quote) {
        try {
            const swapResponse = await executeSwap(
                this.account,
                quote,
                { executeApprove: true ,
                 slippage: 0.5 
                }, 
                this.avnu_options
            );
            return swapResponse;
        } catch (error) {
            console.error("Error executing swap:", error);
            throw error;
        }
    }

    private createProviderConfig() {
        const base_url = process.env.BASE_URL;
        const Starknet_rpc = process.env.STARKNET_RPC;
        const private_key = process.env.PRIVATE_KEY;
        const account_address = process.env.ACCOUNT_ADDRESS;

        if (!private_key || !account_address) {
            throw new Error("PRIVATE_KEY and ACCOUNT_ADDRESS must be set in environment variables");
        }

        return {
            base_url: base_url || "https://starknet.api.avnu.fi",
            Starknet_rpc,
            private_key,
            account_address
        };
    }
}
