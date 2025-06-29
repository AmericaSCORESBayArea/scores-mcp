import { registerValidateSoqlQueryTool } from '../../src/tools/validateSoqlQuery';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

jest.mock('@jetstreamapp/soql-parser-js', () => ({
  parseQuery: jest.fn()
}));
const { parseQuery } = require('@jetstreamapp/soql-parser-js');

describe('registerValidateSoqlQueryTool', () => {
  let server: any;

  beforeEach(() => {
    server = { tool: jest.fn() };
  });

  it('registers the tool with the server', () => {
    registerValidateSoqlQueryTool(server as unknown as McpServer);
    expect(server.tool).toHaveBeenCalled();
  });

  it('returns valid for a valid SOQL query', async () => {
    parseQuery.mockImplementation(() => ({}));
    registerValidateSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'SELECT Id FROM Account' });
    expect(result.content[0].text).toContain('valid');
  });

  it('returns error for an invalid SOQL query', async () => {
    parseQuery.mockImplementation(() => { throw new Error('Syntax error'); });
    registerValidateSoqlQueryTool(server as unknown as McpServer);
    const toolCall = server.tool.mock.calls[0][4];
    const result = await toolCall({ query: 'BAD QUERY' });
    expect(result.content[0].text).toContain('Invalid SOQL query');
  });
}); 