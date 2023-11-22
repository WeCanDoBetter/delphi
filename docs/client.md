# The Client Function

Delphi does not dictate which provider you use. By leaving the implementation of
the client function up to you, you can use any provider you want.

However, under the hood, we make use of TypeScript types from the
[Azure OpenAI SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai).
Your client function's responses should be compatible with these types.

## Exampe using the OpenAI API

```ts
import { Agent, type ClientFunction } from "@wecandobetter/delphi";
import { OpenAIClient, OpenAIKeyCredential } from "@azure/openai";

// Create a client for the OpenAI API
const credential = new OpenAIKeyCredential(/* your key */);
const client = new OpenAIClient(credential);

// Define the client function
const clientFn: ClientFunction = async (messages, options) => {
  const response = client.getChatCompletions(options.model, messages, options);
  return response.choices[0].message!;
};

// Create an agent that uses the OpenAI API
const openAiAgent = new Agent({
  name: "OpenAI Agent",
  client: { model: "gpt-4-1106-preview" },
  clientFn,
});
```
