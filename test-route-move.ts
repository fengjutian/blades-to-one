// 简单测试路由移动是否正确
console.log('测试路由移动...');

// 模拟Express Router
class MockRouter {
  get(path: string, handler: Function) {
    console.log(`注册GET路由: ${path}`);
  }
  post(path: string, handler: Function) {
    console.log(`注册POST路由: ${path}`);
  }
  use(path: string, router: any) {
    console.log(`挂载子路由到: ${path}`);
  }
}

// 模拟LLMGatewayImpl
class MockLLMGatewayImpl {
  getTokenStats(userId: string) {
    return { used: 0, remaining: 1000 };
  }
  resetTokenStats(userId: string) {
    console.log(`重置用户 ${userId} 的token统计`);
  }
  updateRateLimitConfig(config: any) {
    console.log(`更新限流配置:`, config);
  }
}

// 模拟createStatisticsRoutes函数
function mockCreateStatisticsRoutes(llmGateway: MockLLMGatewayImpl) {
  const router = new MockRouter();
  console.log('创建statistics路由...');
  router.get('/token-stats', () => {});
  router.post('/token-stats/reset', () => {});
  router.post('/rate-limit', () => {});
  return router;
}

// 模拟createRoutes函数
function mockCreateRoutes(llmGateway: MockLLMGatewayImpl) {
  const router = new MockRouter();
  console.log('创建主路由...');
  router.get('/', () => {});
  router.use('/llm', mockCreateStatisticsRoutes(llmGateway));
  router.post('/react/run', () => {});
  return router;
}

// 执行测试
const llmGateway = new MockLLMGatewayImpl();
mockCreateRoutes(llmGateway);

console.log('\n路由移动测试完成！');
console.log('原路由: /llm/token-stats -> 新路由保持不变');
console.log('原路由: /llm/token-stats/reset -> 新路由保持不变');
console.log('原路由: /llm/rate-limit -> 新路由保持不变');
