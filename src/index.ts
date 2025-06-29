import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerRunSoqlQueryTool } from "./tools/runSoqlQuery.js";
import { registerValidateSoqlQueryTool } from "./tools/validateSoqlQuery.js";
import { registerDescribeGlobalTool } from "./tools/describeGlobal.js";
import { registerDescribeObjectTool } from "./tools/describeObject.js";

// Create server instance
const server = new McpServer({
  name: "scores-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

registerRunSoqlQueryTool(server);
registerValidateSoqlQueryTool(server);
registerDescribeGlobalTool(server);
registerDescribeObjectTool(server);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
  }
  
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });