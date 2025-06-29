import fetch from "node-fetch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import dotenv from 'dotenv';
import { SalesforceGlobal } from "@types";
import { filterSalesforceGlobal } from "@utils";
dotenv.config();

const SALESFORCE_DIRECT_API_URL = process.env.SALESFORCE_DIRECT_API_URL;
const SALESFORCE_DIRECT_CLIENT_ID = process.env.SALESFORCE_DIRECT_CLIENT_ID;
const SALESFORCE_DIRECT_CLIENT_SECRET = process.env.SALESFORCE_DIRECT_CLIENT_SECRET;
if (!SALESFORCE_DIRECT_API_URL || !SALESFORCE_DIRECT_CLIENT_ID || !SALESFORCE_DIRECT_CLIENT_SECRET) {
  throw new Error("Check your .env file and make sure all required variables are set.");
}

export function registerDescribeGlobalTool(server: McpServer) {
  server.tool(
    "describe-global",
    "Retrieve global information about the Salesforce database.",
    {},
    {
      title: "Describe Global",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async () => {
      const response = await fetch(`${SALESFORCE_DIRECT_API_URL}/salesforce/describe/global`, {
        method: "GET",
        headers: {
          "client_id": SALESFORCE_DIRECT_CLIENT_ID!,
          "client_secret": SALESFORCE_DIRECT_CLIENT_SECRET!,
        },
      });
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Describe Global API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }
      const data = await response.json() as SalesforceGlobal;
      const filteredData = filterSalesforceGlobal(data);
      return {
        status: response.status,
        content: [
          {
            type: "text",
            text: JSON.stringify(filteredData, null, 2),
          },
        ],
      };
    }
  );
} 