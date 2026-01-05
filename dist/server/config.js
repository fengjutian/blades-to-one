"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicPath = exports.getLLMClientConfig = exports.getServerConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// 加载环境变量
dotenv_1.default.config();
const getServerConfig = () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    llmTokensPerSecond: parseInt(process.env.LLM_TOKENS_PER_SECOND || '1000', 10),
    llmMaxBurstTokens: parseInt(process.env.LLM_MAX_BURST_TOKENS || '5000', 10),
});
exports.getServerConfig = getServerConfig;
const getLLMClientConfig = (clientType) => {
    const config = {};
    switch (clientType) {
        case 'kimi':
            config.apiKey = process.env.KIMI_API_KEY;
            break;
        case 'openai':
            config.apiKey = process.env.OPENAI_API_KEY;
            break;
        case 'qwen':
            config.apiKey = process.env.QWEN_API_KEY;
            break;
        case 'deepseek':
            config.apiKey = process.env.DEEPSEEK_API_KEY;
            break;
        case 'coze':
            config.apiKey = process.env.COZE_API_KEY;
            config.baseUrl = process.env.COZE_BASE_URL;
            config.defaultWorkflow = process.env.COZE_DEFAULT_WORKFLOW;
            break;
        case 'ollama':
            config.baseUrl = process.env.OLLAMA_BASE_URL;
            config.defaultModel = process.env.OLLAMA_DEFAULT_MODEL;
            break;
        default:
            break;
    }
    return config;
};
exports.getLLMClientConfig = getLLMClientConfig;
const getPublicPath = () => {
    return path_1.default.join(__dirname, '../../public');
};
exports.getPublicPath = getPublicPath;
