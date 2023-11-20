# 📘 Delphi Tutorial: Creating a Wikipedia Search Agent

In this tutorial, we'll guide you through creating a conversational agent using
Delphi that can perform Wikipedia searches. This agent will leverage the Azure
OpenAI client for communication and a custom agent function for searching
Wikipedia.

## 📚 Prerequisites

- Ensure you have Node.js installed.
- Set up a project with TypeScript.
- Install the `@azure/openai` and `wikipedia` npm packages.

## Step 1: Import Dependencies

First, import all the necessary modules at the top of your TypeScript file:

```typescript
import { OpenAIClient, OpenAIKeyCredential } from "@azure/openai";
import wikipedia from "wikipedia";

import {
  Agent,
  AgentFunction,
  Context,
  type JSONSchemaType,
} from "@wecandobetter/delphi";
```

## Step 2: Define Search Parameters and Results

Define interfaces for your search parameters and the expected search results:

```typescript
interface SearchParameters {
  query: string;
  limit?: number;
  suggestion?: boolean;
}

interface SearchResult {
  results: string[];
  suggestion?: string;
}
```

## Step 3: Create a JSON Schema

Define a JSON schema for validating the input to your search function:

```typescript
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
```

## Step 4: Implement the Search Function

Create an instance of `AgentFunction` that performs the Wikipedia search:

```typescript
const searchFn = new AgentFunction<SearchParameters, SearchResult>(
  "search",
  "Search on Wikipedia",
  searchSchema,
  async ({ query, limit = 5, suggestion = true }) => {
    const { results, suggestion: sugg } = await wikipedia.search(query, {
      limit,
      suggestion,
    });
    return { results: results.map(({ title }) => title), suggestion: sugg };
  },
);
```

## Step 5: Set Up the OpenAI Client

Configure the OpenAI client with your API key:

```typescript
const client = new OpenAIClient(new OpenAIKeyCredential("<API_KEY>"));
```

## Step 6: Create the Agent

Instantiate an `Agent` that will handle chat completions:

```typescript
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
  { client: { model: "gpt-4-1106-preview" } },
);
```

## Step 7: Initialize the Context

Create a new `Context` and add a system message to it:

```typescript
const context = new Context();
context.addMessage({
  role: "system",
  content:
    "Search Wikipedia for a random scientific subject and tell me about it.",
});
```

## Step 8: Register and Enable the Function

Register your search function in the context and enable it:

```typescript
context.functions.set(searchFn.name, searchFn);
context.functions.enable(searchFn.name);
```

## Step 9: Run the Agent and Display the Result

Finally, run the agent with the context and log the result:

```typescript
const result = await agent.run(context);
console.log(result.content);
```

## 🎉 Conclusion

Congratulations! You've successfully created a Delphi agent that can search
Wikipedia based on user prompts and display the results. This tutorial showcases
the integration of custom agent functions, use of external APIs, and
conversation management in Delphi. Feel free to expand and customize your agent
to suit your specific needs.
