import { Reasoner } from './reasoner';
import { HistoryItem } from './types';
import { CozeOrchestrator } from '../workflow/coze-orchestrator';
export declare class Agent {
    private reasoner;
    private maxSteps;
    private history;
    private textHistory;
    private cozeOrchestrator?;
    /**
     * 创建一个新的智能体实例
     * @param reasoner 负责思考/逻辑的推理器组件
     * @param maxSteps 允许的最大推理步骤数（默认：8）
     * @param cozeOrchestrator Coze Studio服务编排器（可选，用于复杂任务的服务编排）
     */
    constructor(reasoner: Reasoner, maxSteps?: number, cozeOrchestrator?: CozeOrchestrator);
    /**
     * 获取当前的交互历史记录
     * @returns 历史记录项数组
     */
    getHistory(): HistoryItem[];
    /**
     * 运行智能体通过多个推理步骤处理用户查询
     * @param userQuery 用户的查询/输入
     * @returns 包含最终答案和完整历史记录的对象
     */
    run(userQuery: string): Promise<{
        final: string;
        history: HistoryItem[];
    }>;
    /**
     * 判断是否需要使用Coze Studio服务编排
     * 可以根据查询的复杂度、关键词等条件进行判断
     * @param userQuery 用户查询
     * @returns 是否需要使用Coze Studio服务编排
     */
    private shouldUseCozeOrchestration;
    /**
     * 判断在工具执行后是否需要使用Coze Studio服务编排进行后续处理
     * @param toolName 工具名称
     * @param observation 工具执行结果
     * @returns 是否需要使用Coze Studio服务编排
     */
    private shouldUseCozeOrchestrationAfterTool;
}
