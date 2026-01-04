import { LLMClient } from './types';
/**
 * Reasoner class responsible for building prompts and generating thoughts
 * using the LLM client based on the ReAct framework
 */
export declare class Reasoner {
    private llm;
    /**
     * Creates a new Reasoner instance
     * @param llm The LLM client to use for generating responses
     */
    constructor(llm: LLMClient);
    /**
     * Builds a prompt for the LLM based on the user query and conversation history
     * @param userQuery The current user query
     * @param history The conversation history
     * @returns Formatted prompt string for the LLM
     */
    buildPrompt(userQuery: string, history: string[]): string;
    /**
     * Generates a thought/response from the LLM based on the user query and history
     * @param userQuery The current user query
     * @param history The conversation history
     * @returns The LLM's response
     */
    think(userQuery: string, history: string[]): Promise<string>;
}
