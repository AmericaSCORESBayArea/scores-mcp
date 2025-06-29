import fetch from "node-fetch";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from 'dotenv'; 
dotenv.config();

const SOQL_API_URL = process.env.SALESFORCE_DIRECT_API_URL;
const SOQL_CLIENT_ID = process.env.SALESFORCE_DIRECT_CLIENT_ID;
const SOQL_CLIENT_SECRET = process.env.SALESFORCE_DIRECT_CLIENT_SECRET;
if (!SOQL_API_URL || !SOQL_CLIENT_ID || !SOQL_CLIENT_SECRET) {
  throw new Error("Check your .env file and make sure all required variables are set.");
}

export function registerRunSoqlQueryTool(server: McpServer) {
  server.tool(
    "run-soql-query",
    "Run a SOQL query against the Salesforce API and return the results.",
    {
      query: z.string().describe("The SOQL query to execute."),
    },
    {
      title: "Run SOQL Query",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ query }: { query: string }) => {
        const response = await fetch(`${SOQL_API_URL}/salesforce/soql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client_id": SOQL_CLIENT_ID!,
          "client_secret": SOQL_CLIENT_SECRET!,
        },
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`SOQL API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }
      const data = await response.json();
      return {
        status: response.status,
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
} 