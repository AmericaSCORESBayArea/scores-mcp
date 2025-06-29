import { registerDescribeObjectTool } from '../../src/tools/describeObject';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('registerDescribeObjectTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
    process.env.SALESFORCE_DIRECT_API_URL = 'http://mock.api';
    process.env.SALESFORCE_DIRECT_CLIENT_ID = 'mock-client-id';
    process.env.SALESFORCE_DIRECT_CLIENT_SECRET = 'mock-client-secret';
  });

  it('registers the tool with the server', () => {
    registerDescribeObjectTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles API response correctly', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ mock: 'object' }),
    });
    registerDescribeObjectTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ objectName: 'Account' });
    expect(result.content[0].text).toContain('mock');
  });

  it('throws error on API failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Not found',
    });
    registerDescribeObjectTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    await expect(toolCall({ objectName: 'Account' })).rejects.toThrow('Describe Object API error');
  });
}); 