import { LLMClient } from "../core/types";

/**
 * Coze Studio客户端类，用于与Coze Studio API交互
 * 实现了LLMClient接口，可以作为服务编排工具集成到ReAct-agent中
 */
export class CozeClient implements LLMClient {
  private apiKey: string;
  private baseURL: string;
  private workflowId: string;

  /**
   * 创建Coze Studio客户端实例
   * @param apiKey Coze Studio API密钥
   * @param baseURL Coze Studio API基础URL (默认: https://api.coze.com/v1)
   * @param workflowId Coze Studio工作流ID
   */
  constructor(
    apiKey: string,
    baseURL: string = "https://api.coze.com/v1",
    workflowId?: string
  ) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.workflowId = workflowId || "";
  }

  /**
   * 调用Coze Studio API执行工作流或模型推理
   * @param prompt 输入提示
   * @param opts 可选参数，包括workflowId(工作流ID)和temperature(温度)
   * @returns Coze Studio的响应结果
   */
  async call(
    prompt: string,
    opts?: { workflowId?: string; temperature?: number }
  ): Promise<string> {
    try {
      // 确定要使用的工作流ID
      const targetWorkflowId = opts?.workflowId || this.workflowId;
      
      // 构建请求体
      const requestBody = {
        workflow_id: targetWorkflowId,
        inputs: {
          prompt: prompt
        },
        parameters: {
          temperature: opts?.temperature || 0.2,
          max_tokens: 1000
        }
      };

      // 发送请求到Coze Studio API
      const response = await fetch(`${this.baseURL}/workflows/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Coze Studio API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      // 解析响应数据
      const data = await response.json();
      
      // 处理响应结果
      if (data && data.result && data.result.content) {
        return data.result.content;
      } else if (data && data.outputs && data.outputs.content) {
        return data.outputs.content;
      } else {
        throw new Error("Invalid Coze Studio response format");
      }
    } catch (error) {
      console.error("Coze Studio API call failed:", error);
      throw error;
    }
  }

  /**
   * 获取工作流列表
   * @returns 工作流列表
   */
  async getWorkflows(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/workflows`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflows: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.workflows || [];
    } catch (error) {
      console.error("Failed to get Coze Studio workflows:", error);
      throw error;
    }
  }

  /**
   * 设置默认工作流ID
   * @param workflowId 工作流ID
   */
  setDefaultWorkflow(workflowId: string): void {
    this.workflowId = workflowId;
  }
}
