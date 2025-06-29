import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import pkg from "@jetstreamapp/soql-parser-js";
const { parseQuery } = pkg;

export function registerValidateSoqlQueryTool(server: McpServer) {
  server.tool(
    "validate-soql-query",
    "Validate a SOQL query using @jetstreamapp/soql-parser-js. Returns whether the query is valid and any error message.",
    {
      query: z.string().describe("The SOQL query to validate."),
    },
    {
      title: "Validate SOQL Query",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ query }: { query: string }) => {
      try {
        parseQuery(query);
        return {
          content: [
            {
              type: "text",
              text: "SOQL query is valid.",
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid SOQL query: ${error.message || error}`,
            },
          ],
        };
      }
    }
  );
} 