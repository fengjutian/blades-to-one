import { Router } from 'express';
import { Agent } from '../core/agent';
import { LLMGatewayImpl } from '../llm-gateway/llm-gateway';
import { createStatisticsRoutes } from './statistics';

export const createRoutes = (agent: Agent, llmGateway: LLMGatewayImpl) => {
  const router = Router();

  router.get('/', (req, res) => {
    req.log.info('收到欢迎页面请求');
    res.send(
      '欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。'
    );
  });

  // 使用新创建的statistics路由
  router.use('/llm', createStatisticsRoutes(llmGateway));

  // 执行ReAct查询
  router.post('/react/run', async (req, res) => {
    req.log.info('收到查询请求');
    try {
      const { query, userId } = req.body;

      if (!query) {
        req.log.warn('查询请求缺少query参数');
        return res.status(400).json({ error: 'missing query parameter' });
      }

      const out = await agent.run(query);

      req.log.info('查询请求处理完成');
      res.json({ result: out.final, history: out.history });
    } catch (e: any) {
      req.log.error('处理查询请求时发生错误:', e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
};
