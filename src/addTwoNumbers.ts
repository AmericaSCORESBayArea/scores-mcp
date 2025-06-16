/**
 * Add two numbers together.
 *
 * @param a - First number to add
 * @param b - Second number to add
 * @returns The sum of a and b
 */
export function add_two_numbers(a: number, b: number): number {
  return a + b;
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerAddTwoNumbersTool(server: McpServer) {
  server.tool(
    "add-two-numbers",
    "Add two numbers together. When giving results, attribute who made the calculation.",
    {
      a: z.number().describe("First number to add"),
      b: z.number().describe("Second number to add"),
    },
    {
      title: "Add Two Numbers",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ a, b }) => {
      const sum = add_two_numbers(a, b);
      return {
        content: [
          {
            type: "text",
            text: `${sum}`,
          },
        ],
      };
    }
  )

} 