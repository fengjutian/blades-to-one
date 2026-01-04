import { LLMClient } from '../core/types';
/**
 * Coze Studio客户端类，用于与Coze Studio API交互
 * 实现了LLMClient接口，可以作为服务编排工具集成到ReAct-agent中
 */
export declare class CozeClient implements LLMClient {
    private apiKey;
    private baseURL;
    private workflowId;
    /**
     * 创建Coze Studio客户端实例
     * @param apiKey Coze Studio API密钥
     * @param baseURL Coze Studio API基础URL (默认: https://api.coze.com/v1)
     * @param workflowId Coze Studio工作流ID
     */
    constructor(apiKey: string, baseURL?: string, workflowId?: string);
    /**
     * 调用Coze Studio API执行工作流或模型推理
     * @param prompt 输入提示
     * @param opts 可选参数，包括workflowId(工作流ID)和temperature(温度)
     * @returns Coze Studio的响应结果
     */
    call(prompt: string, opts?: {
        workflowId?: string;
        temperature?: number;
    }): Promise<string>;
    /**
     * 获取工作流列表
     * @returns 工作流列表
     */
    getWorkflows(): Promise<any[]>;
    /**
     * 设置默认工作流ID
     * @param workflowId 工作流ID
     */
    setDefaultWorkflow(workflowId: string): void;
}
