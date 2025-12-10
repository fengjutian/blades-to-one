import { LLMClient } from "../core/types";
/**
 * Kimi LLM client implementation
 * Uses the OpenAI-compatible API provided by Moonshot AI
 * Kimi is a large AI model developed by Moonshot AI
 */
export declare class KimiClient implements LLMClient {
    private client;
    /**
     * Creates a new Kimi client
     * @param apiKey The Kimi API key from Moonshot AI
     */
    constructor(apiKey: string);
    /**
     * Calls the Kimi API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
