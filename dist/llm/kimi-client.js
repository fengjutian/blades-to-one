"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KimiClient = void 0;
const openai_1 = __importDefault(require("openai"));
/**
 * Kimi LLM client implementation
 * Uses the OpenAI-compatible API provided by Moonshot AI
 * Kimi is a large AI model developed by Moonshot AI
 */
class KimiClient {
    /**
     * Creates a new Kimi client
     * @param apiKey The Kimi API key from Moonshot AI
     */
    constructor(apiKey) {
        this.client = new openai_1.default({ apiKey, baseURL: "https://api.moonshot.cn/v1/" });
    }
    /**
     * Calls the Kimi API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    async call(prompt, opts) {
        const model = opts?.model || "kimi-k2-0905-preview";
        const resp = await this.client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: opts?.temperature ?? 0.2,
            max_tokens: 800
        });
        const text = resp.choices?.[0]?.message?.content ?? JSON.stringify(resp);
        return String(text);
    }
}
exports.KimiClient = KimiClient;
