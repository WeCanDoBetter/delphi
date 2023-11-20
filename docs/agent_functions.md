# 📘 Delphi Tutorial: Using Agent Functions

In Delphi, agent functions are a versatile tool allowing your conversational
agent to execute specific tasks, like data retrieval or complex computations,
dynamically during a conversation. Let's dive into how you can utilize these
functions in your Delphi projects.

## Step 1: Setting Up Your Environment

Before beginning, ensure you have Delphi and its dependencies installed in your
project. If you haven't already set up Delphi, refer to the 'Getting Started'
section of the Delphi README.

## Step 2: Define an Agent Function

An agent function in Delphi takes an input, performs an operation, and returns
an output. To define one:

1. **Create a New Function Class**: Define a new class for your function.

2. **Specify Input Schema**: Define a JSON schema for the input. This schema is
   used to validate the data your function will receive.

3. **Implement the Function Logic**: Write the core logic of your function in
   the constructor.

Example:

```typescript
import { AgentFunction, type JSONSchemaType } from "@wecandobetter/delphi";

interface ExampleInput {
  query: string;
}

const exampleInputSchema: JSONSchemaType<ExampleInput> = {
  type: "object",
  properties: {
    query: { type: "string" },
  },
  required: ["query"],
};

const exampleFunction = new AgentFunction<ExampleInput, string>(
  "exampleFunction",
  "This is an example function",
  exampleInputSchema,
  async ({ query }) => {
    // Your function logic here, returning a string
    return `You queried: ${query}`;
  },
);
```

## Step 3: Register and Enable the Function

With your function defined, the next step is to register it with your agent's
context and enable it.

```typescript
const context = new Context();

context.addFunction(exampleFunction);
context.functions.enable(exampleFunction.name);
```

## Conclusion

Agent functions in Delphi provide a powerful way to extend the capabilities of
your conversational agents. By defining custom functions, registering them with
your agent, and then utilizing them in conversation flows, you can create rich,
interactive, and dynamic conversational experiences. The key is to tailor these
functions to fit the specific needs and contexts of your application. Happy
coding!
