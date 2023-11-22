# Delphi API Reference > Function Map

The `FunctionMap` class in the Delphi framework is a specialized map used to
store and manage functions callable by an agent. Below is a detailed API
reference for this class.

## Class: `FunctionMap`

A map for storing `AgentFunction` instances with additional capabilities to
enable or disable functions.

### Constructor

```typescript
constructor(functions?: IterableIterator<AgentFunction<any, any>>, enable = false)
```

Initializes a new instance of `FunctionMap`.

| Parameter   | Type                                | Description                                        |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| `functions` | `Iterable<AgentFunction<any, any>>` | An optional iterable of `AgentFunction` instances. |

### Properties

- `enabled`: Returns a readonly array of the names of enabled functions.

### Methods

#### `addFunction`

Adds a function to the map.

```typescript
addFunction(fn: AgentFunction<any, any>): void
```

| Parameter | Type                      | Description          |
| --------- | ------------------------- | -------------------- |
| `fn`      | `AgentFunction<any, any>` | The function to add. |

_Throws_: `Error` if the function already exists in the map.

#### `addFunctions`

Adds multiple functions to the map.

```typescript
addFunctions(...fns: (AgentFunction<any, any> | { fn: AgentFunction<any, any>, enabled?: boolean })[]): void
```

| Parameter | Type                                                                                | Description                                                                                  |
| --------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `fns`     | `(AgentFunction<any, any> \| { fn: AgentFunction<any, any>, enabled?: boolean })[]` | An array of `AgentFunction` instances or objects containing a function and an optional flag. |

_Throws_: `Error` if any of the functions already exist in the map.

#### `enable`

Enables a function in the map by its name or function instance.

```typescript
enable(name: string): void
enable(fn: AgentFunction<any, any>): void
```

| Parameter | Type                      | Description               |
| --------- | ------------------------- | ------------------------- |
| `name`    | `string`                  | The name of the function. |
| `fn`      | `AgentFunction<any, any>` | The function to enable.   |

_Throws_: `Error` if the function does not exist.

#### `enableAll`

Enables all functions in the map.

```typescript
enableAll(): void
```

#### `disable`

Disables a function in the map by its name.

```typescript
disable(name: string): void
disable(fn: AgentFunction<any, any>): void
```

| Parameter | Type                      | Description               |
| --------- | ------------------------- | ------------------------- |
| `name`    | `string`                  | The name of the function. |
| `fn`      | `AgentFunction<any, any>` | The function to disable.  |

_Throws_: `Error` if the function does not exist.

#### `disableAll`

Disables all functions in the map.

```typescript
disableAll(): void
```

#### `build`

Builds and returns an array of `FunctionDefinition` objects based on the enabled
functions.

```typescript
build(): FunctionDefinition[]
```

_Returns_: `FunctionDefinition[]` - An array of function definitions for the
enabled functions.

## Usage Example

```typescript
const functionMap = new FunctionMap();

// Adding functions
const myFunction = new AgentFunction(/* ... */);
functionMap.addFunction(myFunction);

// Enabling and disabling functions
functionMap.enable(myFunction);
functionMap.disable("anotherFunctionName");

// Building function definitions for use
const functionDefinitions = functionMap.build();
```

In this example, `functionMap` is an instance of `FunctionMap` where a custom
function is added and then enabled. The `build` method is used to prepare
function definitions based on the enabled functions.

The `FunctionMap` class provides a convenient way to manage the functions your
Delphi agent can call, with the flexibility to enable or disable functions as
needed. This class is integral to the modular and dynamic nature of the Delphi
framework.
