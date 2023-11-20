## 🔧 Function Calling in Delphi

One of the powerful features of Delphi is its ability to handle function calls
within the conversational flow. This capability allows the agent to execute
specific tasks or retrieve information dynamically during a conversation. Here's
an overview of how function calling works in Delphi:

### Defining Functions

- **Custom Functions:** You can define custom functions tailored to your
  specific needs. These functions can perform various tasks like fetching data
  from an API, processing user input, or carrying out computations.
- **Schema Validation:** Delphi uses JSON schemas to validate the inputs of
  these functions, ensuring data integrity and correctness.

### Registering Functions

- **Function Registration:** After defining a function, you need to register it
  with the context. This registration process tells the context which functions
  are available for use during a conversation.

  ```typescript
  const myFunction = new AgentFunction(/* ... configuration ... */);
  context.addFunction(myFunction);
  ```

### Enabling Functions

- **Enabling for Use:** Once registered, a function must be explicitly enabled.
  This step offers control over which functions are active at any given time.

  ```typescript
  context.functions.enable(myFunction.name);
  ```

### Function Invocation

- **During Conversations:** The model may invoke functions during a
  conversation. This will enhance the agent's context, allowing it to respond
  more intelligently to the user, and to perform more complex tasks.

### Handling Responses

- **Response Integration:** The results from function calls are seamlessly
  integrated into the conversation. Depending on your function's design, it can
  directly influence the agent's next response or modify the conversation's
  context.

### Practical Example

Here's a simple example of how you might use a function within a Delphi agent:

```typescript
// Define a custom function
const fetchWeatherInfo = new AgentFunction(
  "getWeather",
  "Fetch current weather information",
  weatherSchema, // Your defined JSON schema for input validation
  async (params) => {
    // Logic to fetch weather information
    return { ...weatherData };
  },
);

// Register and enable the function
context.addFunction(fetchWeatherInfo);
context.functions.enable(fetchWeatherInfo.name);

// During conversation, this function can be called based on user input or other triggers
```

This function calling mechanism enhances Delphi's flexibility, allowing for
dynamic and interactive conversations that can adapt based on external data or
complex logic. Whether you're building a simple chatbot or a sophisticated
virtual assistant, Delphi's function calling capability is a robust tool in your
development arsenal.
