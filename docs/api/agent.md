# Delphi API Reference > Agent

This API reference provides details on the key classes and interfaces used in
the Delphi framework for creating conversational agents.

## Interfaces and Types

### `BaseClientOptions`

Base configuration options for a client.

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
| `azureExtensionOptions` | `AzureExtensionsOptions` | Configuration for Azure OpenAI chat extensions.                                           |

### `ClientOptions`

Extends `BaseClientOptions` with an additional `model` field.

| Property | Type     | Description                                       |
| -------- | -------- | ------------------------------------------------- |
| `model`  | `string` | Name of the AI model (for both Azure and OpenAI). |

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

### `RunOptions`

Configuration options for running an agent.

| Property    | Type          | Description                     |
| ----------- | ------------- | ------------------------------- |
| `signal`    | `AbortSignal` | Signal for aborting the run     |
| `maxRounds` | `number`      | Maximum number of rounds to run |

### `RunResult`

A type representing the result of running an agent.

| Property  | Type          | Description                   |
| --------- | ------------- | ----------------------------- |
| `round`   | `number`      | The round number              |
| `message` | `ChatMessage` | The message sent by the agent |
| `done`    | `boolean`     | Whether the agent is done     |

## Class `Agent`

A class representing an agent used to run conversations.

### Static Properties

| Property          | Type                  | Description                    |
| ----------------- | --------------------- | ------------------------------ |
| `DEFAULT_OPTIONS` | `DefaultAgentOptions` | Default options for the agent. |

### Properties

| Property      | Type           | Description                        |
| ------------- | -------------- | ---------------------------------- |
| `name`        | `string`       | Name of the agent                  |
| `description` | `string`       | Description of the agent           |
| `options`     | `AgentOptions` | Configuration options of the agent |

### Constructor

```typescript
constructor(options: AgentOptions)
```

Initializes a new instance of `Agent`.

| Parameter | Type           | Description                  |
| --------- | -------------- | ---------------------------- |
| `options` | `AgentOptions` | Configuration options of the |

### Method: `run`

Runs the agent with a given context.

```typescript
async* run(context: Context, options: RunOptions): AsyncIterableIterator<ChatMessage>
```

_Parameters_:

| Parameter | Type         | Description                                  |
| --------- | ------------ | -------------------------------------------- |
| `context` | `Context`    | The context to run the agent with.           |
| `options` | `RunOptions` | Configuration options for running the agent. |

_Returns_: `AsyncIterableIterator<RunResult>` - An iterator of run results.

### Error Handling

The `run` method includes error handling for:

- Non-existent or disabled functions.
- Errors in parsing function arguments.
- Failures during function execution.

This comprehensive API reference should aid in understanding and utilizing the
core components of the Delphi framework for building conversational agents.
