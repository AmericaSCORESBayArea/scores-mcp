import { registerDescribeGlobalTool } from '../../tools/describeGlobal.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

describe('registerDescribeGlobalTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
  });

  it('registers the tool with the server', () => {
    registerDescribeGlobalTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles 200 response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    registerDescribeGlobalTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall();
    expect(result.content[0].text).toContain('\"success\": true');
  });
}); 