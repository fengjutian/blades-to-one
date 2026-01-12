"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMClientFactory = void 0;
const mock_client_1 = require("../llm/mock-client");
const openai_client_1 = require("../llm/openai-client");
const kimi_client_1 = require("../llm/kimi-client");
const ollama_client_1 = require("../llm/ollama-client");
const qwen_client_1 = require("../llm/qwen-client");
const deepseek_client_1 = require("../llm/deepseek-client");
const config_1 = require("./config");
class LLMClientFactory {
    static createClient() {
        const clientTypes = [
            'kimi',
            'openai',
            'qwen',
            'deepseek',
            'ollama',
            'mock',
        ];
        for (const clientType of clientTypes) {
            try {
                const client = this.createSpecificClient(clientType);
                if (client) {
                    return { client, type: clientType };
                }
            }
            catch (error) {
                console.warn(`Failed to create ${clientType} client:`, error);
                continue;
            }
        }
        // 默认使用Mock客户端
        return { client: new mock_client_1.MockLLMClient(), type: 'mock' };
    }
    static createSpecificClient(clientType) {
        const config = (0, config_1.getLLMClientConfig)(clientType);
        switch (clientType) {
            case 'kimi':
                if (config.apiKey) {
                    return new kimi_client_1.KimiClient(config.apiKey);
                }
                break;
            case 'openai':
                if (config.apiKey) {
                    return new openai_client_1.OpenAIClient(config.apiKey);
                }
                break;
            case 'qwen':
                if (config.apiKey) {
                    return new qwen_client_1.QwenClient(config.apiKey);
                }
                break;
            case 'deepseek':
                if (config.apiKey) {
                    return new deepseek_client_1.DeepSeekClient(config.apiKey);
                }
                break;
            case 'ollama':
                return new ollama_client_1.OllamaClient({
                    baseURL: config.baseUrl,
                    defaultModel: config.defaultModel,
                });
            case 'mock':
                return new mock_client_1.MockLLMClient();
            default:
                return null;
        }
        return null;
    }
}
exports.LLMClientFactory = LLMClientFactory;
