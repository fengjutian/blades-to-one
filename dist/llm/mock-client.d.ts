import { LLMClient } from "../core/types";
/**
 * Mock LLM client implementation for testing and development
 * Simulates LLM responses without making actual API calls
 */
export declare class MockLLMClient implements LLMClient {
    /**
     * Simulates an LLM call by returning predefined responses based on prompt content
     * @param prompt The prompt that would be sent to an LLM
     * @returns A simulated LLM response in ReAct format
     */
    call(prompt: string): Promise<string>;
}
