import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerRunSoqlQueryTool } from '../../src/tools/runSoqlQuery';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

vi.mock('node-fetch', () => vi.fn());
const fetch = await import('node-fetch');

describe('registerRunSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: vi.fn() };
    process.env.SALESFORCE_DIRECT_API_URL = 'http://mock.api';
    process.env.SALESFORCE_DIRECT_CLIENT_ID = 'mock-client-id';
    process.env.SALESFORCE_DIRECT_CLIENT_SECRET = 'mock-client-secret';
  });

  it('registers the tool with the server', () => {
    registerRunSoqlQueryTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles API response correctly', async () => {
    vi.mocked(fetch.default).mockResolvedValue({
      ok: true,
      json: async () => ({ records: [1, 2, 3] }),
    } as any);
    registerRunSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Account' });
    expect(result.content[0].text).toContain('records');
  });

  it('throws error on API failure', async () => {
    vi.mocked(fetch.default).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Bad query',
    } as any);
    registerRunSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    await expect(toolCall({ query: 'SELECT Id FROM Account' })).rejects.toThrow('SOQL API error');
  });
}); 