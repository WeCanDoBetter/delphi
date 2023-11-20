```ts
import { OpenAIClient, OpenAIKeyCredential } from "@azure/openai";
import type { JSONSchemaType } from "./types";
import { AgentFunction } from "./AgentFunction";
import { Agent } from "./Agent";
import { Context } from "./Context";
import wikipedia from "wikipedia";

interface SearchParameters {
  /** The query to search for. */
  query: string;
  /** The maximum number of results to return. */
  limit?: number;
  /** Whether to return a suggestion if there are no results. */
  suggestion?: boolean;
}

interface SearchResult {
  /** The results of the search. */
  results: string[];
  /** A suggested search query. */
  suggestion?: string;
}

// Create a JSON schema for the AI model's function input
const searchSchema: JSONSchemaType<SearchParameters> = {
  type: "object",
  properties: {
    query: { type: "string" },
    limit: { type: "number", nullable: true },
    suggestion: { type: "boolean", nullable: true },
  },
  required: ["query"],
  additionalProperties: false,
};

// Create the function
const searchFn = new AgentFunction<
  SearchParameters,
  SearchResult
>(
  "search",
  "Search on Wikipedia",
  searchSchema,
  async ({ query, limit = 5, suggestion = true }) => {
    // Search on Wikipedia
    const { results, suggestion: sugg } = await wikipedia.search(
      query,
      { limit, suggestion },
    );

    // Return the results and suggestion
    return {
      results: results.map(({ title }) => title),
      suggestion: sugg,
    };
  },
);

// Create an OpenAI client
const client = new OpenAIClient(new OpenAIKeyCredential("<API_KEY>"));

// Create the agent
const agent = new Agent(
  "wiki",
  async (messages, options) => {
    const response = await client.getChatCompletions(
      options.model,
      messages,
      options,
    );
    return response.choices[0].message!;
  },
  {
    client: {
      model: "gpt-4-1106-preview",
    },
  },
);

// Create a context
const context = new Context();

// Add the system message to the context
context.addMessage({
  role: "system",
  content:
    "Search Wikipedia for a random scientific subject and tell me about it.",
});

// Set and enable the function
context.functions.set(searchFn.name, searchFn);
context.functions.enable(searchFn.name);

// run the agent with the function included in the context
const result = await agent.run(context);
console.log(result.content);
```
