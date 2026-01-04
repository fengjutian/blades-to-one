import { CozeClient } from "../llm/coze-client";
import { HistoryItem } from "../core/types";
/**
 * Coze Studio服务编排器类
 * 用于管理和调用Coze Studio工作流，实现复杂任务的服务编排
 */
export declare class CozeOrchestrator {
    private cozeClient;
    private defaultWorkflowId;
    /**
     * 创建Coze Studio服务编排器实例
     * @param apiKey Coze Studio API密钥
     * @param baseURL Coze Studio API基础URL
     * @param defaultWorkflowId 默认工作流ID
     */
    constructor(apiKey: string, baseURL?: string, defaultWorkflowId?: string);
    /**
     * 使用Coze Studio工作流执行任务
     * @param task 任务描述或输入
     * @param workflowId 工作流ID（可选，默认使用构造时指定的工作流）
     * @param history 历史记录（可选）
     * @returns 工作流执行结果
     */
    executeTask(task: string, workflowId?: string, history?: HistoryItem[]): Promise<string>;
    /**
     * 构建包含历史记录的任务输入
     * @param task 任务描述
     * @param history 历史记录
     * @returns 完整的任务输入字符串
     */
    private buildTaskInput;
    /**
     * 获取可用的工作流列表
     * @returns 工作流列表
     */
    getAvailableWorkflows(): Promise<any[]>;
    /**
     * 设置默认工作流ID
     * @param workflowId 工作流ID
     */
    setDefaultWorkflow(workflowId: string): void;
    /**
     * 获取当前使用的Coze客户端实例
     * @returns CozeClient实例
     */
    getCozeClient(): CozeClient;
}
