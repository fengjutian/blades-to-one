"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pino_http_1 = __importDefault(require("pino-http"));
const cors_1 = __importDefault(require("cors"));
const agent_1 = require("../core/agent");
const reasoner_1 = require("../core/reasoner");
const llm_gateway_1 = require("../llm-gateway/llm-gateway");
const config_1 = require("./config");
const llm_client_factory_1 = require("./llm-client-factory");
const routes_1 = require("./routes");
// 导入认证路由
const auth_routes_1 = __importDefault(require("./auth/auth-routes"));
// 初始化应用
const app = (0, express_1.default)();
// 配置CORS，允许来自前端的请求
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
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
// 注册认证路由
app.use('/api/auth', auth_routes_1.default);
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
// 创建代理
const agent = new agent_1.Agent(reasoner, 6);
// 注册路由
app.use('/', (0, routes_1.createRoutes)(agent, llmGateway));
// 启动服务器
app.listen(serverConfig.port, () => {
    console.log(`Server listening on http://localhost:${serverConfig.port}`);
});
