/**
 * Coze Studio集成测试
 * 用于验证Coze Studio服务编排与ReAct-agent的集成功能
 */

import { Agent } from "../src/core/agent";
import { Reasoner } from "../src/core/reasoner";
import { MockLLMClient } from "../src/llm/mock-client";
import { CozeOrchestrator } from "../src/workflow/coze-orchestrator";

/**
 * 运行Coze Studio集成测试
 */
async function runCozeIntegrationTests() {
  console.log("=== Coze Studio 集成测试开始 ===\n");

  try {
    // 测试1: CozeOrchestrator实例创建
    console.log("测试1: CozeOrchestrator实例创建");
    const apiKey = "test-api-key";
    const cozeOrchestrator = new CozeOrchestrator(apiKey);
    
    // 验证实例创建成功
    if (cozeOrchestrator instanceof CozeOrchestrator) {
      console.log("✓ CozeOrchestrator实例创建成功");
    } else {
      console.log("✗ CozeOrchestrator实例创建失败");
      return false;
    }

    // 测试2: 使用CozeOrchestrator创建Agent实例
    console.log("\n测试2: 使用CozeOrchestrator创建Agent实例");
    const mockLLM = new MockLLMClient();
    const reasoner = new Reasoner(mockLLM);
    
    const agent = new Agent(reasoner, 8, cozeOrchestrator);
    
    // 验证Agent实例创建成功
    if (agent instanceof Agent) {
      console.log("✓ 使用CozeOrchestrator创建Agent实例成功");
    } else {
      console.log("✗ 使用CozeOrchestrator创建Agent实例失败");
      return false;
    }

    // 测试3: 任务复杂度检测逻辑
    console.log("\n测试3: 任务复杂度检测逻辑");
    
    // 使用反射获取私有方法进行测试
    const shouldUseCozeOrchestration = (agent as any).shouldUseCozeOrchestration;
    
    // 测试包含复杂任务关键词的查询
    const testCases = [
      { query: "请帮我完成一个复杂的多步骤工作流", expected: true },
      { query: "使用workflow编排一个流程", expected: true },
      { query: "orchestrate a multi-step process", expected: true },
      { query: "今天天气怎么样？", expected: false },
      { query: "什么是人工智能？", expected: false }
    ];
    
    let allTestsPassed = true;
    testCases.forEach((testCase, index) => {
      const result = shouldUseCozeOrchestration(testCase.query);
      const status = result === testCase.expected ? "✓" : "✗";
      console.log(`${status} 测试用例 ${index + 1}: ${testCase.query}`);
      console.log(`   期望: ${testCase.expected}, 实际: ${result}`);
      
      if (result !== testCase.expected) {
        allTestsPassed = false;
      }
    });
    
    if (allTestsPassed) {
      console.log("\n✓ 所有任务复杂度检测测试通过");
    } else {
      console.log("\n✗ 部分任务复杂度检测测试失败");
      return false;
    }

    console.log("\n=== 所有Coze Studio集成测试通过！ ===");
    return true;
  } catch (error) {
    console.error("\n✗ 集成测试失败:", error);
    return false;
  }
}

/**
 * 如果直接执行此文件，则运行测试
 */
if (require.main === module) {
  runCozeIntegrationTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}