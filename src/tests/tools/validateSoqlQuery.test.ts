import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerValidateSoqlQueryTool } from '../../tools/validateSoqlQuery.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock the soql-parser-js package
vi.mock('@jetstreamapp/soql-parser-js', () => ({
  default: {
    parseQuery: vi.fn()
  }
}));

describe('registerValidateSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: vi.fn() };
  });

  it('registers the tool with the server', () => {
    registerValidateSoqlQueryTool(server);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles valid query correctly', async () => {
    registerValidateSoqlQueryTool(server);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Contact LIMIT 1' });
    expect(result.content[0].text).toContain('valid');
    console.log("Test content:", result.content);
  });
}); 