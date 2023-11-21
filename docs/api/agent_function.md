# Delphi API Reference > Agent Function

This API reference details the `AgentFunction` class in the Delphi framework,
which is used for defining custom functions callable by agents during
conversations.

## `AgentFn` Type

`AgentFn` is a generic type for agent functions.

```typescript
export type AgentFn<Input, Output> = (value: Input) => Promise<Output>;
```

| Type     | Description                              |
| -------- | ---------------------------------------- |
| `Input`  | Type of input the function will receive. |
| `Output` | Type of output the function will return. |

## Class: `AgentFunction`

This class represents a function that an agent can call.

### Properties

- `name: string`: The name of the function.
- `description: string`: A brief description of what the function does.
- `schema: JSONSchemaType<Input>`: The JSON schema for validating the function's
  input.

### Constructor

```typescript
constructor(name: string, description: string, schema: JSONSchemaType<Input>, fn: AgentFn<Input, Output>)
```

Initializes a new instance of `AgentFunction`.

| Parameter     | Type                     | Description                       |
| ------------- | ------------------------ | --------------------------------- |
| `name`        | `string`                 | Name of the function.             |
| `description` | `string`                 | Description of the function.      |
| `schema`      | `JSONSchemaType<Input>`  | JSON schema for input validation. |
| `fn`          | `AgentFn<Input, Output>` | The function to be executed.      |

### Methods

#### `validate`

Validates the input against the defined schema.

```typescript
async validate(value: Input): Promise<Input>
```

- **Parameters**: `value: Input` - The input to validate.
- **Returns**: `Promise<Input>` - The validated input.
- **Throws**: `AggregateError` if the input is invalid.

#### `run`

Executes the function with validated input.

> **Note:** This method validates the input before executing the function. You
> do not need to call `validate` before calling `run`.

```typescript
async run(value: Input): Promise<Output>
```

- **Parameters**: `value: Input` - The input to the function.
- **Returns**: `Promise<Output>` - The output of the function.
- **Throws**: `AggregateError` if the input is invalid or if the function
  execution fails.

## Usage Example

```typescript
const myFunction = new AgentFunction<InputType, OutputType>(
  "myFunctionName",
  "This function does something",
  myInputSchema,
  async (input) => {
    // Function logic here
  },
);
```

Use the `AgentFunction` class to define custom functions for your agent,
ensuring they have proper input validation and clear, descriptive names and
purposes. This class provides a robust way to extend the functionality of your
agent in the Delphi framework.
