/**
 * 使用小型模型进行推理
 * @param prompt 输入提示
 * @returns 模型推理结果
 */
export declare function modelSmall(prompt: string): Promise<string>;
/**
 * 使用大型模型进行推理
 * @param prompt 输入提示
 * @returns 模型推理结果
 */
export declare function modelLarge(prompt: string): Promise<string>;
