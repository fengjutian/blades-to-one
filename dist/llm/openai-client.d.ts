import { LLMClient } from '../core/types';
/**
 * OpenAI LLM client implementation
 * Uses the official OpenAI SDK to interact with OpenAI's models
 */
export declare class OpenAIClient implements LLMClient {
    private client;
    /**
     * Creates a new OpenAI client
     * @param apiKey The OpenAI API key
     */
    constructor(apiKey: string);
    /**
     * Calls the OpenAI API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
