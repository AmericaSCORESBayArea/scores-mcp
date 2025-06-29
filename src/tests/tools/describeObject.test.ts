import { describe, it, expect } from 'vitest';
import { registerDescribeObjectTool } from '../../tools/describeObject';
import dotenv from 'dotenv';

dotenv.config();

describe('describeObject Tool', () => {
  it('has required environment variables', () => {
    expect(process.env.SALESFORCE_DIRECT_API_URL).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_ID).toBeDefined();
    expect(process.env.SALESFORCE_DIRECT_CLIENT_SECRET).toBeDefined();
  });

  it('makes real API call and returns 200 with defined content', async () => {
    let toolHandler: ((input: { objectName: string }) => Promise<any>) | undefined;
    const mockServer: any = {
      tool: (_name: any, _desc: any, _input: any, _hints: any, handler: any) => {
        toolHandler = handler;
      }
    };
    registerDescribeObjectTool(mockServer);
    expect(toolHandler).toBeDefined();
    const result = await toolHandler!({ objectName: 'Account' });
    expect(result.status).toBe(200);
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].text).toBeDefined();
    console.log("Test content:", result.content);

  });
});
