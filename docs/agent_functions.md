# 📘 Delphi Tutorial: Using Agent Functions

In Delphi, agent functions are a versatile tool allowing your conversational
agent to execute specific tasks, like data retrieval or complex computations,
dynamically during a conversation. Let's dive into how you can utilize these
functions in your Delphi projects.

## Defining Functions

- **Custom Functions:** You can define custom functions tailored to your
  specific needs. These functions can perform various tasks like fetching data
  from an API, processing user input, or carrying out computations.
- **Schema Validation:** Delphi uses JSON schemas to validate the inputs of
  these functions, ensuring data integrity and correctness.

## Registering Functions

- **Function Registration:** After defining a function, you need to register it
  with the context. This registration process tells the context which functions
  are available for use during a conversation.

  ```typescript
  const myFunction = new AgentFunction(/* ... configuration ... */);
  context.addFunction(myFunction, true); // second argument is whether to enable immediately
  ```

## Enabling And Disabling Functions

- **Enabling:** Once registered, a function may not be immediately enabled. This
  step offers control over which functions are active at any given time. To
  enable a function, use the `enable` method on the `functions` property of the
  context.

  ```typescript
  context.functions.enable(myFunction.name);
  ```
- **Disabling:** To disable a function, use the `disable` method on the
  `functions` property of the context.

  ```typescript
  context.functions.disable(myFunction.name);
  ```

  Disabled functions will not be available to the agent during conversations.

## Function Invocation

- **During Conversations:** The model may invoke functions during a
  conversation. This will enhance the agent's context, allowing it to respond
  more intelligently to the user, and to perform more complex tasks.

## Handling Responses

- **Response Integration:** The results from function calls are seamlessly
  integrated into the conversation. Depending on your function's design, it can
  directly influence the agent's next response or modify the conversation's
  context.

## Example

```typescript
import { AgentFunction, type JSONSchemaType } from "@wecandobetter/delphi";

interface WeatherParameters {
  location: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const weatherSchema: JSONSchemaType<WeatherParameters> = {
  type: "object",
  properties: {
    location: {
      type: "string",
      description:
        "The location to fetch weather information for (e.g. 'New York, NY').",
    },
  },
  required: ["location"],
  additionalProperties: false,
};

// Define a custom function
const fetchWeatherInfo = new AgentFunction<WeatherParameters, WeatherData>(
  "getWeather",
  "Fetch current weather information",
  weatherSchema, // Your defined JSON schema for input validation
  async (params) => {
    // Logic to fetch weather information
    return {
      temperature: 22.5, // in Celsius
      humidity: 0.5,
      windSpeed: 10,
  },
);
```

## Conclusion

Agent functions in Delphi provide a powerful way to extend the capabilities of
your conversational agents. By defining custom functions, registering them with
your agent, and then utilizing them in conversation flows, you can create rich,
interactive, and dynamic conversational experiences. The key is to tailor these
functions to fit the specific needs and contexts of your application. Happy
coding!
