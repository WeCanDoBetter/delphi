# Delphi API Reference

This API reference provides details on the key classes and interfaces used in
the Delphi framework for creating conversational agents.

## Interfaces and Types

### `GetChatCompletionsOptions`

Options for configuring chat completions.

| Property                | Type                     | Description                                                                               |
| ----------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `maxTokens`             | `number`                 | Maximum number of tokens to generate.                                                     |
| `temperature`           | `number`                 | Controls the creativity of generated completions. Higher values yield more random output. |
| `topP`                  | `number`                 | Nucleus sampling value for considering tokens with a certain probability mass.            |
| `logitBias`             | `Record<string, number>` | Map of token IDs to bias scores, influencing token probability in completions.            |
| `user`                  | `string`                 | Identifier for the caller or end user, for tracking or rate-limiting.                     |
| `stop`                  | `string[]`               | Textual sequences that will end completions generation.                                   |
| `presencePenalty`       | `number`                 | Influences token probability based on their presence in generated text.                   |
| `frequencyPenalty`      | `number`                 | Influences token probability based on their cumulative frequency.                         |
| `stream`                | `boolean`                | Indicates if chat completions should be streamed.                                         |
| `model`                 | `string`                 | Model name for the completions request (also for Azure OpenAI).                           |
| `azureExtensionOptions` | `AzureExtensionsOptions` | Configuration for Azure OpenAI chat extensions.                                           |

### `ClientOptions`

Extends `GetChatCompletionsOptions` with an additional `model` field.

| Property | Type     | Description          |
| -------- | -------- | -------------------- |
| `model`  | `string` | Name of the AI model |

### `ClientFunction`

A function type that handles chat message interactions.

| Parameter  | Type            | Description            |
| ---------- | --------------- | ---------------------- |
| `messages` | `ChatMessage[]` | Array of chat messages |
| `options`  | `ClientOptions` | Options for the client |

_Returns_: `Promise<ChatMessage>`

### `AgentOptions`

Configuration options for an `Agent`.

| Property      | Type            | Description                     |
| ------------- | --------------- | ------------------------------- |
| `maxRounds`   | `number`        | Maximum number of rounds to run |
| `description` | `string`        | Description of the agent        |
| `client`      | `ClientOptions` | Client configuration options    |

### `DefaultAgentOptions`

A type representing required fields from `AgentOptions`.

## Class `Agent`

A class representing an agent used to run conversations.

### Properties

- `static DEFAULT_OPTIONS: DefaultAgentOptions`: Default options for the agent.
- `name: string`: The name of the agent.
- `description?: string`: The description of the agent.
- `options: AgentOptions`: Configuration options of the agent.

### Constructor

```typescript
constructor(name: string, client: ClientFunction, options: AgentOptions)
```

Initializes a new instance of `Agent`.

### Method: `run`

Runs the agent with a given context and round.

> The round is used internally when the model repeatedly calls functions. When
> calling the agent directly, the round should be set to 1. If `maxRounds` is
> reached, the agent will omit the functions and return the chat message as
> usual.

```typescript
async run(context: Context, round = 1): Promise<ChatMessage>
```

_Parameters_:

- `context: Context`: The context to run the agent with.
- `round: number`: The current round number (default is 1).

_Returns_: `Promise<ChatMessage>` - The result of the agent's operation.

### Error Handling

The `run` method includes error handling for:

- Non-existent or disabled functions.
- Errors in parsing function arguments.
- Failures during function execution.

This comprehensive API reference should aid in understanding and utilizing the
core components of the Delphi framework for building conversational agents.
