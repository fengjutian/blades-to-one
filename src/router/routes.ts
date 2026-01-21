import { Router } from 'express';
import { Agent } from '../core/agent';
import { LLMGatewayImpl } from '../llm-gateway/llm-gateway';
import { createStatisticsRoutes } from './statistics';
import { createReactRoutes } from './react';
import { createPromptsRoutes } from './prompts';
import { createDocsRoutes } from './docs';
import uploadRouter from './universal/upload';

export const createRoutes = (agent: Agent, llmGateway: LLMGatewayImpl) => {
  const router = Router();

  router.get('/', (req, res) => {
    req.log.info('收到欢迎页面请求');
    res.send(
      '欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。'
    );
  });

  router.use('/llm', createStatisticsRoutes(llmGateway));
  router.use('/react', createReactRoutes(agent));
  router.use('/prompts', createPromptsRoutes());
  router.use('/docs', createDocsRoutes());
  router.use('/docs', uploadRouter);

  return router;
};