import { registerValidateSoqlQueryTool } from '../../tools/validateSoqlQuery.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock the soql-parser-js package
jest.mock('@jetstreamapp/soql-parser-js', () => ({
  default: {
    parseQuery: jest.fn()
  }
}));

describe('registerValidateSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
  });

  it('registers the tool with the server', () => {
    registerValidateSoqlQueryTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('handles valid query correctly', async () => {
    registerValidateSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Contact LIMIT 1' });
    expect(result.content[0].text).toContain('valid');
  });
}); 