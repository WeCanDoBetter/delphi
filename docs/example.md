# Example

Here's a simple example of how you might use a function within a Delphi agent.
This example uses the [OpenAI API](https://openai.com/) to search Wikipedia and
tell the user about a random scientific subject.

In this example, we create two agent functions:

- `search`: Searches Wikipedia for a given query and returns the results.
- `intro`: Gets the introduction of a Wikipedia article.

We then create an agent that uses the OpenAI API to generate responses. The
agent is configured to use the `gpt-4-1106-preview` model. The agent's context
is configured to use the `search` and `intro` functions.

```ts
import { OpenAIClient, OpenAIKeyCredential } from "@azure/openai";
import {
  Agent,
  AgentFunction,
  Context,
  type JSONSchemaType,
} from "@wecandobetter/delphi";
import wikipedia from "wikipedia";
```

First we define the input and output types for the search function. The input is
validated using a JSON schema. The output is a list of search results and an
optional suggestion.

```ts
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
    query: {
      type: "string",
      description: "The query to search for.",
    },
    limit: {
      type: "number",
      nullable: true,
      description: "Mximum number of results to return (default: 5).",
    },
    suggestion: {
      type: "boolean",
      nullable: true,
      description: "Return a suggestion if there are no results.",
    },
  },
  required: ["query"],
  additionalProperties: false,
};
```

Then we define the search function. The function uses the `wikipedia` package to
search Wikipedia for the given query. It returns the results and an optional
suggestion.

```ts
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
```

Next we define the input type for the intro function. The input is validated
using a JSON schema. The output is the introduction of the article.

```ts
interface IntroParameters {
  /** The title of the article. */
  title: string;
}

const introSchema: JSONSchemaType<IntroParameters> = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "The title of the article.",
    },
  },
  required: ["title"],
  additionalProperties: false,
};
```

Then we define the intro function. The function uses the `wikipedia` package to
get the introduction of the given article. It returns the introduction.

```ts
const introFn = new AgentFunction<IntroParameters, string>(
  "intro",
  "Get the introduction of a Wikipedia article",
  introSchema,
  async ({ title }) => {
    // Get the introduction of the article
    const intro = await wikipedia.intro(title);

    // Return the introduction
    return intro;
  },
);
```

Finally, we create the agent. The agent uses the OpenAI API to generate
responses. The agent's context is configured to use the `search` and `intro`
functions.

```ts
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
    "Search Wikipedia for a random scientific subject and tell the user about it.",
});

// Set and enable the functions
context.addFunction(searchFn);
context.functions.enable(searchFn.name);

context.addFunction(introFn);
context.functions.enable(introFn.name);
```

Now we can run the agent with the context. The agent will use the functions
defined in the context to process the messages.

```ts
// run the agent with the function included in the context
const result = await agent.run(context);
console.log(result.content);
```

This shows how you can use functions to enhance your agent's capabilities.
