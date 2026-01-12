import { Reasoner } from './reasoner';
import { HistoryItem } from './types';
export declare class Agent {
    private reasoner;
    private maxSteps;
    private history;
    private textHistory;
    /**
     * 创建一个新的智能体实例
     * @param reasoner 负责思考/逻辑的推理器组件
     * @param maxSteps 允许的最大推理步骤数（默认：8）
     */
    constructor(reasoner: Reasoner, maxSteps?: number);
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
}
