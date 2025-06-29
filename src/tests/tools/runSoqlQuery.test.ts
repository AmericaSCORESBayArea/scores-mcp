import { registerRunSoqlQueryTool } from '../../tools/runSoqlQuery.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

describe('registerRunSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
  });

  it('registers the tool with the server', () => {
    registerRunSoqlQueryTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles 200 response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    registerRunSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Contact LIMIT 1' });
    expect(result.content[0].text).toContain('\"success\": true');
  });
}); 