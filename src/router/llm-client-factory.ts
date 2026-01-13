import { LLMClient } from '../core/types';
import { MockLLMClient } from '../llm/mock-client';
import { OpenAIClient } from '../llm/openai-client';
import { KimiClient } from '../llm/kimi-client';
import { OllamaClient } from '../llm/ollama-client';
import { QwenClient } from '../llm/qwen-client';
import { DeepSeekClient } from '../llm/deepseek-client';
import { getLLMClientConfig } from './config';

export class LLMClientFactory {
  static createClient(): { client: LLMClient; type: string } {
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
      } catch (error) {
        console.warn(`Failed to create ${clientType} client:`, error);
        continue;
      }
    }

    // 默认使用Mock客户端
    return { client: new MockLLMClient(), type: 'mock' };
  }

  private static createSpecificClient(clientType: string): LLMClient | null {
    const config = getLLMClientConfig(clientType);

    switch (clientType) {
      case 'kimi':
        if (config.apiKey) {
          return new KimiClient(config.apiKey);
        }
        break;

      case 'openai':
        if (config.apiKey) {
          return new OpenAIClient(config.apiKey);
        }
        break;

      case 'qwen':
        if (config.apiKey) {
          return new QwenClient(config.apiKey);
        }
        break;

      case 'deepseek':
        if (config.apiKey) {
          return new DeepSeekClient(config.apiKey);
        }
        break;

      case 'ollama':
        return new OllamaClient({
          baseURL: config.baseUrl,
          defaultModel: config.defaultModel,
        });

      case 'mock':
        return new MockLLMClient();

      default:
        return null;
    }

    return null;
  }
}
