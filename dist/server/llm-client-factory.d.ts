import { LLMClient } from '../core/types';
export declare class LLMClientFactory {
    static createClient(): {
        client: LLMClient;
        type: string;
    };
    private static createSpecificClient;
}
