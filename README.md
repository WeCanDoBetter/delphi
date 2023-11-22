# 🏛️ Delphi

Delphi is a versatile and adaptable conversational agent framework that
streamlines chatbots and AI-driven agent systems. Its design prioritizes
abstraction and provider-independence, allowing for seamless integration with
various message providers. Delphi is compatible with a range of environments,
including browsers, Node.js, and Deno, making it an ideal choice for diverse
application scenarios.

> **Note:** Delphi is currently in development. While usable, the API is subject
> to change. If you encounter a bug, please
> [open an issue](https://github.com/WeCanDoBetter/delphi/issues/new) and help
> us improve the framework!

## 🚀 Features

- 🤖 **Provider-Independent:** Delphi abstracts the messaging function, allowing
  seamless integration with various providers like OpenAI and Azure OpenAI.
- 📞 **Function Calling:** The agent can call functions to perform tasks such as
  querying a database or making an API call, and incorporate the results into
  the conversation.
- 🔄 **Flexible Conversational Flow:** Manages complex conversation patterns
  with ease, facilitating intelligent and context-aware interactions.
- 🛠️ **Customizable Agent Options:** Tailor your agent with configurable settings
  such as maximum rounds and specific model preferences.
- 🌍 **Cross-Platform Compatibility:** Works effortlessly in browsers, Node.js,
  and Deno environments.
- 📝 **Schema Validation:** Ensures the integrity and correctness of data with
  JSON schema validation.
- 🎛️ **Modular Design:** Facilitates easy integration and scalability through a
  clear and modular code structure.

## 📌 Requirements

- Node.js (v18 or newer), a modern browser, or Deno
- TypeScript
- An account with a supported message provider (e.g., Azure, OpenAI)

## 🛠️ Installation

Delphi is available on npm and can be easily installed:

```bash
npm install @wecandobetter/delphi
```

## 🚀 Getting Started

To quickly get started with Delphi:

1. **Import Delphi:** Import the necessary components from Delphi in your
   project.
   ```typescript
   import { Agent, Context } from "@wecandobetter/delphi";
   ```

2. **Create an Agent:** Instantiate an `Agent` with your desired configuration.
   ```typescript
   const agent = new Agent("myAgent" /* ... configuration ... */);
   ```

3. **Initialize Context:** Set up a `Context` to manage the conversation state.
   ```typescript
   const context = new Context();

   context.addMessage({
     role: "system",
     content: "You are a helpful assistant!",
   });

   context.addMessage({
     role: "user",
     content: "Hello, I need help.",
   });
   ```

4. **Run the Agent:** Start the agent with the initialized context.
   ```typescript
   for (const { message } of agent.run(context)) {
     console.log(message.content); // "Sure, how can I help?"
   }
   ```

This example gives you a basic setup for initiating a conversation with Delphi.
For more detailed usage and advanced features, refer to the documentation.

## 📖 Documentation

- [Agent Functions](./docs/agent_functions.md)
- [Function Calling](./docs/function_calling.md)
- [Example: Wikipedia](./docs/example.md)
- [API Reference](./docs/api/README.md)

Visit the [documentation](https://wecandobetter.github.io/delphi/) for
information on API usage and advanced features.

## 🤝 Contributing

Contributions are welcome! Create an issue, open a pull request, or reach out to
us in the discussions section.

## 📜 License

Delphi is released under the MIT License. See the [LICENSE](LICENSE) file for
more details.

## ✉️ Contact

Reach out to us at [contact@wcdb.life](mailto:contact@wcdb.life) for support or
inquiries.

Happy conversing! 🎉
