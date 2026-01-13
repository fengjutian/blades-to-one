import { Router } from 'express';
import { LLMGatewayImpl } from '../../llm-gateway/llm-gateway';
import { RateLimitConfig } from '../../llm-gateway/types';

export const createStatisticsRoutes = (llmGateway: LLMGatewayImpl) => {
  const router = Router();

  // 获取token统计信息
  router.get('/token-stats', (req, res) => {
    req.log.info('收到token统计信息请求');
    const userId = req.query.userId as string;
    const stats = llmGateway.getTokenStats(userId);
    res.json({ tokenStats: stats });
  });

  // 重置token统计信息
  router.post('/token-stats/reset', (req, res) => {
    req.log.info('收到重置token统计信息请求');
    const userId = req.body?.userId;
    llmGateway.resetTokenStats(userId);
    res.json({ message: 'Token stats reset successfully' });
  });

  // 更新限流配置
  router.post('/rate-limit', (req, res) => {
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

  return router;
};
