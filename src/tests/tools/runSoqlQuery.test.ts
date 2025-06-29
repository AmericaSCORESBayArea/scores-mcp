import { describe, it, expect } from 'vitest';
import { registerRunSoqlQueryTool } from '../../tools/runSoqlQuery.js';
import dotenv from 'dotenv';

dotenv.config();

describe('runSoqlQuery Tool', () => {
  it('has required environment variables', () => {
    expect(process.env.SALESFORCE_DIRECT_API_URL).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_ID).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_SECRET).toBeDefined();
  });

  it('makes real API call and returns 200 with defined content', async () => {
    let toolHandler: ((input: { query: string }) => Promise<any>) | undefined;
    const mockServer: any = {
      tool: (_name: any, _desc: any, _input: any, _hints: any, handler: any) => {
        toolHandler = handler;
      }
    };
    registerRunSoqlQueryTool(mockServer);
    expect(toolHandler).toBeDefined();
    const result = await toolHandler!({ query: 'SELECT Id FROM Account LIMIT 1' });
    expect(result.status).toBe(200);
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].text).toBeDefined();
    console.log("Test content:", result.content);
  });
});
