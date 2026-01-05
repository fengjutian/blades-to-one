"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pino_http_1 = __importDefault(require("pino-http"));
const agent_1 = require("../core/agent");
const reasoner_1 = require("../core/reasoner");
const coze_orchestrator_1 = require("../workflow/coze-orchestrator");
const llm_gateway_1 = require("../llm-gateway/llm-gateway");
const config_1 = require("./config");
const llm_client_factory_1 = require("./llm-client-factory");
const routes_1 = require("./routes");
// 初始化应用
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, pino_http_1.default)({
    // 配置日志格式和级别
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    },
}));
// 静态文件服务
app.use(express_1.default.static((0, config_1.getPublicPath)()));
// 获取服务器配置
const serverConfig = (0, config_1.getServerConfig)();
// 创建LLM客户端
const { client: llmClient, type: clientType } = llm_client_factory_1.LLMClientFactory.createClient();
console.log(`Using ${clientType.charAt(0).toUpperCase() + clientType.slice(1)}Client`);
// 初始化LLM网关
const llmGateway = new llm_gateway_1.LLMGatewayImpl(llmClient, {
    tokensPerSecond: serverConfig.llmTokensPerSecond,
    maxBurstTokens: serverConfig.llmMaxBurstTokens,
});
console.log('LLM Gateway initialized with rate limiting');
// 创建推理器
const reasoner = new reasoner_1.Reasoner(llmGateway);
// 初始化Coze Studio服务编排器
let cozeOrchestrator;
const cozeConfig = (0, config_1.getLLMClientConfig)('coze');
if (cozeConfig.apiKey) {
    cozeOrchestrator = new coze_orchestrator_1.CozeOrchestrator(cozeConfig.apiKey, cozeConfig.baseUrl, cozeConfig.defaultWorkflow);
    console.log('Coze Studio服务编排器已初始化');
}
// 创建代理
const agent = new agent_1.Agent(reasoner, 6, cozeOrchestrator);
// 注册路由
app.use('/', (0, routes_1.createRoutes)(agent, llmGateway));
// 启动服务器
app.listen(serverConfig.port, () => {
    console.log(`Server listening on http://localhost:${serverConfig.port}`);
});
