import * as search from './search';
import * as codeExec from './codeExec';
import * as modelInference from './modelInference';
import * as dbQuery from './dbQuery';
import * as webRequest from './webRequest';

/**
 * Collection of available tools for the agent
 * Maps tool names to their implementation functions
 */
export const Tools = {
  search: search.webSearch,
  code_exec: codeExec.runCode,
  model_small: modelInference.modelSmall,
  model_large: modelInference.modelLarge,
  db_query: dbQuery.dbQuery,
  web_request: webRequest.webRequest,
} as const;

/**
 * Type definition for available tool names
 */
export type ToolName = keyof typeof Tools;
