# Delphi FunctionMap API Reference

The `FunctionMap` class in the Delphi framework is a specialized map used to
store and manage functions callable by an agent. Below is a detailed API
reference for this class.

## Class: `FunctionMap`

A map for storing `AgentFunction` instances with additional capabilities to
enable or disable functions.

### Constructor

```typescript
constructor(functions?: Iterable<AgentFunction<any, any>>)
```

Initializes a new instance of `FunctionMap`.

| Parameter   | Type                                | Description                                        |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| `functions` | `Iterable<AgentFunction<any, any>>` | An optional iterable of `AgentFunction` instances. |

### Properties

- `enabled`: Returns a readonly array of the names of enabled functions.

### Methods

#### `enable`

Enables a function in the map by its name.

```typescript
enable(name: string): void
```

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `name`    | `string` | The name of the function to enable. |

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
```

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `name`    | `string` | The name of the function to disable. |

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
functionMap.set(myFunction.name, myFunction);

// Enabling and disabling functions
functionMap.enable("myFunctionName");
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
