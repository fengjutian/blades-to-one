/**
 * 使用小型模型进行推理
 * @param prompt 输入提示
 * @returns 模型推理结果
 */
export async function modelSmall(prompt: string): Promise<string> {
  // 模拟小型模型推理
  // 在生产环境中，这里应该调用实际的小型模型API
  return `小型模型推理结果：针对提示 "${prompt}" 的响应内容`;
}

/**
 * 使用大型模型进行推理
 * @param prompt 输入提示
 * @returns 模型推理结果
 */
export async function modelLarge(prompt: string): Promise<string> {
  // 模拟大型模型推理
  // 在生产环境中，这里应该调用实际的大型模型API
  return `大型模型推理结果：针对提示 "${prompt}" 的详细响应内容，包含更多上下文和深度分析`;
}
