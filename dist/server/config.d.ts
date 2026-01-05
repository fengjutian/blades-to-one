export interface ServerConfig {
    port: number;
    llmTokensPerSecond: number;
    llmMaxBurstTokens: number;
}
export interface LLMClientConfig {
    apiKey?: string;
    baseUrl?: string;
    defaultModel?: string;
    defaultWorkflow?: string;
}
export declare const getServerConfig: () => ServerConfig;
export declare const getLLMClientConfig: (clientType: string) => LLMClientConfig;
export declare const getPublicPath: () => string;
