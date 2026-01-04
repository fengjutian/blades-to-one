"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
/**
 * OpenAI LLM client implementation
 * Uses the official OpenAI SDK to interact with OpenAI's models
 */
class OpenAIClient {
    /**
     * Creates a new OpenAI client
     * @param apiKey The OpenAI API key
     */
    constructor(apiKey) {
        this.client = new openai_1.default({ apiKey });
    }
    /**
     * Calls the OpenAI API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    async call(prompt, opts) {
        const model = opts?.model || 'gpt-4o-mini';
        const resp = await this.client.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: opts?.temperature ?? 0.2,
            max_tokens: 800,
        });
        const text = resp.choices?.[0]?.message?.content ?? JSON.stringify(resp);
        return String(text);
    }
}
exports.OpenAIClient = OpenAIClient;
