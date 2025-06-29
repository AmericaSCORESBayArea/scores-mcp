import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock the MCP SDK
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

// Mock all tool registration functions
jest.mock('../src/tools/runSoqlQuery.js');
jest.mock('../src/tools/validateSoqlQuery.js');
jest.mock('../src/tools/describeGlobal.js');
jest.mock('../src/tools/describeObject.js');

const { registerRunSoqlQueryTool } = require('../src/tools/runSoqlQuery.js');
const { registerValidateSoqlQueryTool } = require('../src/tools/validateSoqlQuery.js');
const { registerDescribeGlobalTool } = require('../src/tools/describeGlobal.js');
const { registerDescribeObjectTool } = require('../src/tools/describeObject.js');

describe('MCP Server Setup', () => {
  let mockServer: any;
  let mockTransport: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock server instance
    mockServer = {
      connect: jest.fn(),
    };

    // Mock transport
    mockTransport = {};

    // Mock the constructors
    (McpServer as jest.MockedClass<typeof McpServer>).mockImplementation(() => mockServer);
    (StdioServerTransport as jest.MockedClass<typeof StdioServerTransport>).mockImplementation(() => mockTransport);

    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates server with correct configuration', () => {
    // Import the index file to trigger the server creation
    require('../src/index.ts');

    expect(McpServer).toHaveBeenCalledWith({
      name: 'scores-mcp',
      version: '1.0.0',
      capabilities: {
        resources: {},
        tools: {},
      },
    });
  });

  it('registers all tools with the server', () => {
    // Import the index file to trigger tool registration
    require('../src/index.ts');

    expect(registerRunSoqlQueryTool).toHaveBeenCalledWith(mockServer);
    expect(registerValidateSoqlQueryTool).toHaveBeenCalledWith(mockServer);
    expect(registerDescribeGlobalTool).toHaveBeenCalledWith(mockServer);
    expect(registerDescribeObjectTool).toHaveBeenCalledWith(mockServer);
  });

  it('creates stdio transport', () => {
    // Import the index file to trigger transport creation
    require('../src/index.ts');

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('connects server to transport', async () => {
    // Mock the main function to be callable
    const main = require('../src/index.ts');
    
    // Since main is not exported, we need to test the behavior differently
    // This test verifies that the server.connect is called with the transport
    expect(mockServer.connect).toHaveBeenCalledWith(mockTransport);
  });
}); 