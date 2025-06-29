import { registerRunSoqlQueryTool } from '../../src/tools/runSoqlQuery';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('registerRunSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
    process.env.SALESFORCE_DIRECT_API_URL = 'http://mock.api';
    process.env.SALESFORCE_DIRECT_CLIENT_ID = 'mock-client-id';
    process.env.SALESFORCE_DIRECT_CLIENT_SECRET = 'mock-client-secret';
  });

  it('registers the tool with the server', () => {
    registerRunSoqlQueryTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles API response correctly', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ records: [1, 2, 3] }),
    });
    registerRunSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Account' });
    expect(result.content[0].text).toContain('records');
  });

  it('throws error on API failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Bad query',
    });
    registerRunSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    await expect(toolCall({ query: 'SELECT Id FROM Account' })).rejects.toThrow('SOQL API error');
  });
}); 