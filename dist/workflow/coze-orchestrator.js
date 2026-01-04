"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CozeOrchestrator = void 0;
const coze_client_1 = require("../llm/coze-client");
/**
 * Coze Studio服务编排器类
 * 用于管理和调用Coze Studio工作流，实现复杂任务的服务编排
 */
class CozeOrchestrator {
    /**
     * 创建Coze Studio服务编排器实例
     * @param apiKey Coze Studio API密钥
     * @param baseURL Coze Studio API基础URL
     * @param defaultWorkflowId 默认工作流ID
     */
    constructor(apiKey, baseURL = "https://api.coze.com/v1", defaultWorkflowId) {
        this.cozeClient = new coze_client_1.CozeClient(apiKey, baseURL, defaultWorkflowId);
        this.defaultWorkflowId = defaultWorkflowId || "";
    }
    /**
     * 使用Coze Studio工作流执行任务
     * @param task 任务描述或输入
     * @param workflowId 工作流ID（可选，默认使用构造时指定的工作流）
     * @param history 历史记录（可选）
     * @returns 工作流执行结果
     */
    async executeTask(task, workflowId, history) {
        try {
            // 构建包含历史记录的完整任务输入
            const fullInput = this.buildTaskInput(task, history);
            // 执行Coze Studio工作流
            const result = await this.cozeClient.call(fullInput, {
                workflowId: workflowId || this.defaultWorkflowId
            });
            return result;
        }
        catch (error) {
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
    buildTaskInput(task, history) {
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
    async getAvailableWorkflows() {
        try {
            return await this.cozeClient.getWorkflows();
        }
        catch (error) {
            console.error("Failed to get available workflows:", error);
            return [];
        }
    }
    /**
     * 设置默认工作流ID
     * @param workflowId 工作流ID
     */
    setDefaultWorkflow(workflowId) {
        this.defaultWorkflowId = workflowId;
        this.cozeClient.setDefaultWorkflow(workflowId);
    }
    /**
     * 获取当前使用的Coze客户端实例
     * @returns CozeClient实例
     */
    getCozeClient() {
        return this.cozeClient;
    }
}
exports.CozeOrchestrator = CozeOrchestrator;
