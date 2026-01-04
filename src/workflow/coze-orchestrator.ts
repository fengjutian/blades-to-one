import { CozeClient } from "../llm/coze-client";
import { HistoryItem } from "../core/types";

/**
 * Coze Studio服务编排器类
 * 用于管理和调用Coze Studio工作流，实现复杂任务的服务编排
 */
export class CozeOrchestrator {
  private cozeClient: CozeClient;
  private defaultWorkflowId: string;

  /**
   * 创建Coze Studio服务编排器实例
   * @param apiKey Coze Studio API密钥
   * @param baseURL Coze Studio API基础URL
   * @param defaultWorkflowId 默认工作流ID
   */
  constructor(
    apiKey: string,
    baseURL: string = "https://api.coze.com/v1",
    defaultWorkflowId?: string
  ) {
    this.cozeClient = new CozeClient(apiKey, baseURL, defaultWorkflowId);
    this.defaultWorkflowId = defaultWorkflowId || "";
  }

  /**
   * 使用Coze Studio工作流执行任务
   * @param task 任务描述或输入
   * @param workflowId 工作流ID（可选，默认使用构造时指定的工作流）
   * @param history 历史记录（可选）
   * @returns 工作流执行结果
   */
  async executeTask(
    task: string,
    workflowId?: string,
    history?: HistoryItem[]
  ): Promise<string> {
    try {
      // 构建包含历史记录的完整任务输入
      const fullInput = this.buildTaskInput(task, history);
      
      // 执行Coze Studio工作流
      const result = await this.cozeClient.call(fullInput, {
        workflowId: workflowId || this.defaultWorkflowId
      });
      
      return result;
    } catch (error) {
      console.error("Failed to execute Coze Studio workflow:", error);
      throw error;
    }
  }

  /**
   * 构建包含历史记录的任务输入
   * @param task 任务描述
   * @param history 历史记录
   * @returns 完整的任务输入字符串
   */
  private buildTaskInput(task: string, history?: HistoryItem[]): string {
    let input = `Task: ${task}`;
    
    if (history && history.length > 0) {
      input += "\n\nHistory:";
      history.forEach((item, index) => {
        input += `\n${index + 1}. ${item.role}: ${item.content}`;
      });
    }
    
    return input;
  }

  /**
   * 获取可用的工作流列表
   * @returns 工作流列表
   */
  async getAvailableWorkflows(): Promise<any[]> {
    try {
      return await this.cozeClient.getWorkflows();
    } catch (error) {
      console.error("Failed to get available workflows:", error);
      return [];
    }
  }

  /**
   * 设置默认工作流ID
   * @param workflowId 工作流ID
   */
  setDefaultWorkflow(workflowId: string): void {
    this.defaultWorkflowId = workflowId;
    this.cozeClient.setDefaultWorkflow(workflowId);
  }

  /**
   * 获取当前使用的Coze客户端实例
   * @returns CozeClient实例
   */
  getCozeClient(): CozeClient {
    return this.cozeClient;
  }
}
