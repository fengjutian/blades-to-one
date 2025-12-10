/**
 * 发送网络请求
 * @param input 请求参数，可以是URL字符串或包含详细请求信息的对象
 * @returns 请求结果
 */
export declare function webRequest(input: string | {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}): Promise<string>;
