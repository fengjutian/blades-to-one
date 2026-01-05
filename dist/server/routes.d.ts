import { Agent } from '../core/agent';
import { LLMGatewayImpl } from '../llm-gateway/llm-gateway';
export declare const createRoutes: (agent: Agent, llmGateway: LLMGatewayImpl) => import("express-serve-static-core").Router;
