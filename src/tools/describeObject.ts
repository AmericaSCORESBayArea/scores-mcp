import fetch from "node-fetch";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from 'dotenv';
import { SalesforceObject } from "@types";

dotenv.config();

const SALESFORCE_DIRECT_API_URL = process.env.SALESFORCE_DIRECT_API_URL;
const SALESFORCE_DIRECT_CLIENT_ID = process.env.SALESFORCE_DIRECT_CLIENT_ID;
const SALESFORCE_DIRECT_CLIENT_SECRET = process.env.SALESFORCE_DIRECT_CLIENT_SECRET;
if (!SALESFORCE_DIRECT_API_URL || !SALESFORCE_DIRECT_CLIENT_ID || !SALESFORCE_DIRECT_CLIENT_SECRET) {
  throw new Error("Check your .env file and make sure all required variables are set.");
}

export function registerDescribeObjectTool(server: McpServer) {
  server.tool(
    "describe-object",
    "Retrieve information about a particular Salesforce object.",
    {
      objectName: z.string().describe("The Salesforce object name to describe."),
    },
    {
      title: "Describe Object",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ objectName }: { objectName: string }) => {
      const response = await fetch(`${SALESFORCE_DIRECT_API_URL}/salesforce/describe/object/${encodeURIComponent(objectName)}`, {
        method: "GET",
        headers: {
          "client_id": SALESFORCE_DIRECT_CLIENT_ID!,
          "client_secret": SALESFORCE_DIRECT_CLIENT_SECRET!,
        },
      });
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Describe Object API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }
      const data = await response.json() as SalesforceObject; 
      return {
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