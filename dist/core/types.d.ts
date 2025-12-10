/**
 * Available tool names that can be used by the agent
 */
export type ToolName = "search" | "code_exec" | "model_small" | "model_large" | "db_query" | "web_request" | "none";
/**
 * Interface for parsed ReAct framework responses
 */
export interface ReActParsed {
    /** The agent's thought process */
    thought?: string;
    /** The action/tool to be executed */
    action?: ToolName;
    /** Input parameters for the action */
    actionInput?: any;
    /** Final answer when the task is complete */
    finalAnswer?: string;
}
/**
 * Interface for history items in the conversation
 */
export interface HistoryItem {
    /** Role of the participant (agent, tool, or system) */
    role: "agent" | "tool" | "system";
    /** Content of the message */
    content: string;
    /** Additional metadata */
    meta?: any;
}
/**
 * Interface for LLM clients
 */
export interface LLMClient {
    /**
     * Calls the LLM with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
