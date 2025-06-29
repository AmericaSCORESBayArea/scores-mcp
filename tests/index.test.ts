import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock the MCP SDK
vi.mock('@modelcontextprotocol/sdk/server/mcp.js');
vi.mock('@modelcontextprotocol/sdk/server/stdio.js');

// Mock all tool registration functions
vi.mock('../src/tools/runSoqlQuery.js');
vi.mock('../src/tools/validateSoqlQuery.js');
vi.mock('../src/tools/describeGlobal.js');
vi.mock('../src/tools/describeObject.js');

const { registerRunSoqlQueryTool } = await import('../src/tools/runSoqlQuery.js');
const { registerValidateSoqlQueryTool } = await import('../src/tools/validateSoqlQuery.js');
const { registerDescribeGlobalTool } = await import('../src/tools/describeGlobal.js');
const { registerDescribeObjectTool } = await import('../src/tools/describeObject.js');

describe('MCP Server Setup', () => {
  let mockServer: any;
  let mockTransport: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock server instance
    mockServer = {
      connect: vi.fn(),
    };

    // Mock transport
    mockTransport = {};

    // Mock the constructors
    vi.mocked(McpServer).mockImplementation(() => mockServer);
    vi.mocked(StdioServerTransport).mockImplementation(() => mockTransport);

    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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