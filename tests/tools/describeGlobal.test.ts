import { registerDescribeGlobalTool } from '../../src/tools/describeGlobal';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('registerDescribeGlobalTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
    process.env.SALESFORCE_DIRECT_API_URL = 'http://mock.api';
    process.env.SALESFORCE_DIRECT_CLIENT_ID = 'mock-client-id';
    process.env.SALESFORCE_DIRECT_CLIENT_SECRET = 'mock-client-secret';
  });

  it('registers the tool with the server', () => {
    registerDescribeGlobalTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles API response correctly', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ mock: 'data' }),
    });
    registerDescribeGlobalTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall();
    expect(result.content[0].text).toContain('mock');
  });

  it('throws error on API failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Error details',
    });
    registerDescribeGlobalTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    await expect(toolCall()).rejects.toThrow('Describe Global API error');
  });
}); 