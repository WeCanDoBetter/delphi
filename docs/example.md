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

## The `search` Function

First we define the input and output types for the search function. The input is
validated using the JSON schema. The output is a list of search results and an
optional suggestion.

```ts
interface SearchParameters {
  /** The query to search for. */
  query: string;
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
  async ({ query }) => {
    // Search on Wikipedia
    const { results, suggestion } = await wikipedia.search(
      query,
      {
        limit: 5, // limit to 5 results
        suggestion: true, // include a suggestion
      },
    );

    // Return the results and suggestion
    return {
      results: results.map(({ title }) => title),
      suggestion: sugg,
    };
  },
);
```

## The `intro` Function

Next we define the input type for the intro function. The input is validated
using the JSON schema.

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
get the introduction of the given article. It returns the introduction as a
string.

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

## The Agent

Finally, we create the agent. The agent uses the OpenAI API to generate
responses. The agent is configured to use the `gpt-4-1106-preview` model, which
supports function calls.

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
```

## Running the Agent

Now we can create a context and run the agent. The agent will use the functions
defined in the context to process the messages.

```ts
// Create a context
const context = new Context();

// Add the system message to the context
context.addMessage({
  role: "system",
  content:
    "Search Wikipedia for a random scientific subject and tell the user about it. " +
    "Use the `search` function to search Wikipedia and the `intro` function to get the introduction of an article. " +
    "Then use the introduction to tell the user about the subject.",
});

// Set and enable the functions
context.addFunction(searchFn, true);
context.addFunction(introFn, true);
```

Now we can run the agent with the context. The agent will use the functions
defined in the context to process the messages.

```ts
// run the agent with the function included in the context
const result = await agent.run(context);
console.log(result.content); // "Quantum mechanics is a..."
```

This shows how you can use functions to enhance your agent's capabilities.
