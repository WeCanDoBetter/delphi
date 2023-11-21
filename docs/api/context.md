# Delphi API Reference > Context

The `Context` class in the Delphi framework is designed to manage the state of a
conversation, including messages and functions. This API reference details its
usage and capabilities.

## `BuiltContext` Interface

A representation of a context prepared for use with the OpenAI API.

### Properties

- `messages: ChatMessage[]`: An array of messages in the context.
- `functions: FunctionDefinition[]`: An array of function definitions in the
  context.

## Class: `Context`

This class stores and manages messages and functions for a conversational agent.

### Constructor

```typescript
constructor(messages: ChatMessage[] = [], functions?: Iterable<AgentFunction<any, any>>)
```

Initializes a new instance of `Context`.

| Parameter   | Type                                | Description                                   |
| ----------- | ----------------------------------- | --------------------------------------------- |
| `messages`  | `ChatMessage[]`                     | Initial array of chat messages (default: []). |
| `functions` | `Iterable<AgentFunction<any, any>>` | Iterable of functions to add.                 |

### Properties

- `messages`: Returns a readonly array of chat messages in the context.
- `functions`: Returns the `FunctionMap` containing the functions in the
  context.

### Methods

#### `addMessage`

Adds a message to the context.

```typescript
addMessage(message: ChatMessage): void
```

- **Parameters**: `message: ChatMessage` - The message to add.

#### `addFunction`

Adds a function to the context and optionally enables it.

```typescript
addFunction<Input, Output>(fn: AgentFunction<Input, Output>, enable = true): void
```

- **Parameters**:
  - `fn: AgentFunction<Input, Output>` - The function to add.
  - `enable: boolean` - Whether to enable the function (default: `true`).
- **Throws**: `Error` if a function with the same name already exists.

#### `build`

Compiles the context into a `BuiltContext` format for use with the agent.

```typescript
build(): BuiltContext
```

_Returns_: `BuiltContext` - The built context.

#### `duplicate`

Creates a duplicate of the context.

```typescript
duplicate(): Context
```

_Returns_: `Context` - A new instance of `Context` with duplicated messages and
functions.

## Usage Example

```typescript
const myContext = new Context();
myContext.addMessage({ role: "user", content: "Hello, Delphi!" });

const myFunction = new AgentFunction(/* ... */);
myContext.addFunction(myFunction);

const builtContext = myContext.build();
```

In this example, `myContext` is a `Context` instance where a message is added,
followed by a custom function. The `build` method is then used to prepare this
context for interaction with the agent.
