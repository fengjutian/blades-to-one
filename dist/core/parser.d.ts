import { ReActParsed } from './types';
/**
 * 解析LLM的ReAct框架响应为结构化数据
 * @param text LLM的原始文本响应
 * @returns 解析后的ReAct对象，包含finalAnswer、thought、action和actionInput
 */
export declare function parseReAct(text: string): ReActParsed;
