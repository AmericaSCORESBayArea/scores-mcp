import { describe, it, expect } from 'vitest';
import { registerDescribeGlobalTool } from '../../tools/describeGlobal.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

describe('describeGlobal Tool', () => {
  it('has required environment variables', () => {
    expect(process.env.SALESFORCE_DIRECT_API_URL).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_ID).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_SECRET).toBeDefined();
  });

  it('makes real API call and returns 200 with defined content', async () => {
    let toolHandler: (() => Promise<any>) | undefined;
    const mockServer: any = {
      tool: (_name: any, _desc: any, _input: any, _hints: any, handler: any) => {
        toolHandler = handler;
      }
    };
    registerDescribeGlobalTool(mockServer);
    expect(toolHandler).toBeDefined();
    const result = await toolHandler!();
    expect(result.status).toBe(200);
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].text).toBeDefined();
    console.log("Test content:", result.content);
  });
});
