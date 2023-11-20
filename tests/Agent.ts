import { Agent, type AgentOptions, type ClientFunction } from "../src/Agent";
import { Context } from "../src/Context";
import type { ChatMessage } from "../src/types";

describe("Agent", () => {
  // Mock data and functions
  const mockMessage: ChatMessage = { role: "user", content: "Hello" };
  const mockClient = jest.fn().mockResolvedValue(mockMessage);
  const mockAgentOptions: AgentOptions = {
    client: { model: "test-model" },
    maxRounds: 3,
    description: "Test agent",
  };

  // Test constructor
  it("should initialize with provided name, client, and options", () => {
    const agent = new Agent("TestAgent", mockClient, mockAgentOptions);
    expect(agent.name).toBe("TestAgent");
    expect(agent.description).toBe("Test agent");
    expect(agent.options).toEqual({
      ...Agent.DEFAULT_OPTIONS,
      ...mockAgentOptions,
    });
  });

  // Test run method
  describe("run", () => {
    it("should call the client function and add the returned message to the context", async () => {
      const agent = new Agent("TestAgent", mockClient, mockAgentOptions);
      const context = new Context();
      const result = await agent.run(context);

      expect(mockClient).toHaveBeenCalled();
      expect(result).toBe(mockMessage);
      expect(context.messages).toContain(mockMessage);
    });

    it("should throw an error if the function call does not exist in the context", async () => {
      const agent = new Agent("TestAgent", mockClient, mockAgentOptions);
      const context = new Context();

      mockClient.mockResolvedValueOnce({
        ...mockMessage,
        functionCall: { name: "nonExistentFunction", arguments: "{}" },
      });

      await expect(agent.run(context)).rejects.toThrow(Error);
    });

    it("should handle function calls and add the result to the context", async () => {
      // Define a mock function in the context
      // Add more test cases here for various scenarios
    });

    it("should respect the maxRounds option", async () => {
      const agent = new Agent("TestAgent", mockClient, mockAgentOptions);
      const context = new Context();

      // Test that the agent stops after the specified number of rounds
      // Add more test cases here for various scenarios
    });

    // Add more test cases to cover different scenarios, such as
    // handling errors during function execution, function argument parsing,
    // and cases where no function is called.
  });
});
