import * as search from './search';
import * as codeExec from './codeExec';
import * as modelInference from './modelInference';
import * as dbQuery from './dbQuery';
import * as webRequest from './webRequest';
/**
 * Collection of available tools for the agent
 * Maps tool names to their implementation functions
 */
export declare const Tools: {
    readonly search: typeof search.webSearch;
    readonly code_exec: typeof codeExec.runCode;
    readonly model_small: typeof modelInference.modelSmall;
    readonly model_large: typeof modelInference.modelLarge;
    readonly db_query: typeof dbQuery.dbQuery;
    readonly web_request: typeof webRequest.webRequest;
};
/**
 * Type definition for available tool names
 */
export type ToolName = keyof typeof Tools;
