import { Reasoner } from "./reasoner";
import { parseReAct } from "./parser";
import { Tools } from "../tools";
import { HistoryItem, ToolName } from "./types";
import { CozeOrchestrator } from "../workflow/coze-orchestrator";

export class Agent {
  private history: HistoryItem[] = [];
  private textHistory: string[] = [];
  private cozeOrchestrator?: CozeOrchestrator;

  /**
   * 创建一个新的智能体实例
   * @param reasoner 负责思考/逻辑的推理器组件
   * @param maxSteps 允许的最大推理步骤数（默认：8）
   * @param cozeOrchestrator Coze Studio服务编排器（可选，用于复杂任务的服务编排）
   */
  constructor(
    private reasoner: Reasoner, 
    private maxSteps = 8,
    cozeOrchestrator?: CozeOrchestrator
  ) {
    this.cozeOrchestrator = cozeOrchestrator;
  }

  /**
   * 获取当前的交互历史记录
   * @returns 历史记录项数组
   */
  getHistory() {
    return this.history;
  }

  /**
   * 运行智能体通过多个推理步骤处理用户查询
   * @param userQuery 用户的查询/输入
   * @returns 包含最终答案和完整历史记录的对象
   */
  async run(userQuery: string): Promise<{ final: string; history: HistoryItem[] }> {
    // 为新查询重置历史记录
    this.history = [];
    this.textHistory = [];

    // 检查是否需要使用Coze Studio工作流进行服务编排
    // 例如，当用户查询中包含特定关键词或复杂任务描述时
    if (this.cozeOrchestrator && this.shouldUseCozeOrchestration(userQuery)) {
      try {
        this.history.push({ role: "agent", content: "检测到复杂任务，使用Coze Studio服务编排处理..." });
        
        // 使用Coze Studio工作流执行任务
        const orchestrationResult = await this.cozeOrchestrator.executeTask(userQuery);
        
        this.history.push({ role: "agent", content: `Coze Studio服务编排结果: ${orchestrationResult}` });
        return { final: orchestrationResult, history: this.history };
      } catch (error) {
        console.error("Coze Studio服务编排执行失败，回退到标准ReAct流程:", error);
        // 如果Coze Studio执行失败，回退到标准的ReAct流程
        this.history.push({ 
          role: "agent", 
          content: "Coze Studio服务编排执行失败，回退到标准推理流程..." 
        });
      }
    }

    // 通过多个推理步骤处理查询（标准ReAct流程）
    for (let step = 0; step < this.maxSteps; step++) {
      // 获取这一步的LLM思考过程
      const llmOut = await this.reasoner.think(userQuery, this.textHistory);
      
      // 将智能体的响应添加到历史记录
      this.history.push({ role: "agent", content: llmOut });
      this.textHistory.push(`Agent: ${llmOut}`);

      // 解析LLM输出来确定下一步动作
      const parsed = parseReAct(llmOut);

      // 如果有最终答案，返回它
      if (parsed.finalAnswer) {
        this.history.push({ role: "agent", content: `Final Answer: ${parsed.finalAnswer}` });
        return { final: parsed.finalAnswer, history: this.history };
      }

      // 如果没有指定动作，返回思考内容作为回退
      if (!parsed.action || parsed.action === "none") {
        const fallback = parsed.thought ?? "No action and no final answer.";
        return { final: fallback, history: this.history };
      }

      // 执行指定的工具/动作
      const toolName = parsed.action as ToolName;
      const toolFn = (Tools as any)[toolName];
      let observation = "";
      
      try {
        // 使用提供的输入执行工具
        observation = await toolFn(parsed.actionInput?.query ?? parsed.actionInput ?? "");
      } catch (e: any) {
        // 处理工具执行错误
        observation = `Tool error: ${e?.message ?? e}`;
      }

      // 将工具观察结果添加到历史记录
      this.history.push({ 
        role: "tool", 
        content: observation, 
        meta: { action: parsed.action, input: parsed.actionInput } 
      });
      this.textHistory.push(`Observation: ${observation}`);

      // 检查是否需要在工具执行后使用Coze Studio工作流进行后续编排
      if (this.cozeOrchestrator && this.shouldUseCozeOrchestrationAfterTool(toolName, observation)) {
        try {
          this.history.push({ 
            role: "agent", 
            content: "工具执行完成，使用Coze Studio服务编排进行后续处理..." 
          });
          
          // 使用Coze Studio工作流处理工具执行结果
          const orchestrationResult = await this.cozeOrchestrator.executeTask(
            `基于工具执行结果处理原始任务: ${userQuery}\n\n工具执行结果: ${observation}`,
            undefined,
            this.history
          );
          
          this.history.push({ 
            role: "agent", 
            content: `Coze Studio服务编排结果: ${orchestrationResult}` 
          });
          return { final: orchestrationResult, history: this.history };
        } catch (error) {
          console.error("Coze Studio服务编排执行失败，继续标准ReAct流程:", error);
          // 如果Coze Studio执行失败，继续标准的ReAct流程
          this.history.push({ 
            role: "agent", 
            content: "Coze Studio服务编排执行失败，继续标准推理流程..." 
          });
        }
      }
    }

    // 达到最大步骤数但没有最终答案时返回
    return { final: "Max steps reached without final answer", history: this.history };
  }

  /**
   * 判断是否需要使用Coze Studio服务编排
   * 可以根据查询的复杂度、关键词等条件进行判断
   * @param userQuery 用户查询
   * @returns 是否需要使用Coze Studio服务编排
   */
  private shouldUseCozeOrchestration(userQuery: string): boolean {
    // 简单示例：检查查询中是否包含特定关键词
    const complexTaskKeywords = [
      "复杂", "多步骤", "流程", "工作流", 
      "编排", "coordinate", "orchestrate", "workflow"
    ];
    
    const queryLower = userQuery.toLowerCase();
    return complexTaskKeywords.some(keyword => queryLower.includes(keyword));
  }

  /**
   * 判断在工具执行后是否需要使用Coze Studio服务编排进行后续处理
   * @param toolName 工具名称
   * @param observation 工具执行结果
   * @returns 是否需要使用Coze Studio服务编排
   */
  private shouldUseCozeOrchestrationAfterTool(toolName: ToolName, observation: string): boolean {
    // 简单示例：当工具执行结果复杂或需要进一步处理时使用服务编排
    // 例如，当搜索结果包含大量信息需要分析时
    if (toolName === "search" && observation.length > 1000) {
      return true;
    }
    
    // 或者当工具执行结果包含错误需要处理时
    if (observation.startsWith("Tool error:")) {
      return true;
    }
    
    return false;
  }
}