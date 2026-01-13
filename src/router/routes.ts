import { Router } from 'express';
import { Agent } from '../core/agent';
import { LLMGatewayImpl } from '../llm-gateway/llm-gateway';
import { RateLimitConfig } from '../llm-gateway/types';

export const createRoutes = (agent: Agent, llmGateway: LLMGatewayImpl) => {
  const router = Router();

  router.get('/', (req, res) => {
    req.log.info('收到欢迎页面请求');
    res.send(
      '欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。'
    );
  });

  // 获取token统计信息
  router.get('/llm/token-stats', (req, res) => {
    req.log.info('收到token统计信息请求');
    const userId = req.query.userId as string;
    const stats = llmGateway.getTokenStats(userId);
    res.json({ tokenStats: stats });
  });

  // 重置token统计信息
  router.post('/llm/token-stats/reset', (req, res) => {
    req.log.info('收到重置token统计信息请求');
    const userId = req.body?.userId;
    llmGateway.resetTokenStats(userId);
    res.json({ message: 'Token stats reset successfully' });
  });

  // 更新限流配置
  router.post('/llm/rate-limit', (req, res) => {
    req.log.info('收到更新限流配置请求');
    try {
      const config: RateLimitConfig = req.body;
      llmGateway.updateRateLimitConfig(config);
      res.json({ message: 'Rate limit config updated successfully' });
    } catch (e: any) {
      req.log.error('更新限流配置失败:', e);
      res.status(400).json({ error: e.message });
    }
  });

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
