import { Context } from "../src/Context";
import type { ChatMessage, JSONSchemaType } from "../src/types";
import { AgentFunction } from "../src/AgentFunction";

describe("Context", () => {
  // Mock data
  const mockMessage: ChatMessage = {
    role: "user",
    content: "Hello, world!",
  };

  const schema: JSONSchemaType<{ n: number }> = {
    type: "object",
    properties: {
      n: { type: "number" },
    },
    required: ["n"],
    additionalProperties: false,
  };

  const mockFunction = new AgentFunction(
    "test",
    "description",
    schema,
    async ({ n }) => n,
  );

  // Test constructor
  it("should initialize with default values", () => {
    const context = new Context();
    expect(context.messages).toEqual([]);
    expect(context.functions).toBeDefined();
  });

  // Test messages getter
  it("should return messages", () => {
    const context = new Context([mockMessage]);
    expect(context.messages).toContain(mockMessage);
  });

  // Test addMessage
  it("should add a message", () => {
    const context = new Context();
    context.addMessage(mockMessage);
    expect(context.messages).toContain(mockMessage);
  });

  // Test functions getter
  it("should return functions", () => {
    const context = new Context();
    expect(context.functions).toBeDefined();
  });

  // Test addFunction
  it("should add a function", () => {
    const context = new Context();
    context.addFunction(mockFunction);
    expect(context.functions.get(mockFunction.name)).toBe(mockFunction);
  });

  it("should throw an error when adding a function with a duplicate name", () => {
    const context = new Context();
    context.addFunction(mockFunction);
    expect(() => context.addFunction(mockFunction)).toThrow(Error);
  });

  // Test build
  it("should build the context", () => {
    const context = new Context([mockMessage] /* mock function map */);
    const builtContext = context.build();
    expect(builtContext.messages).toContain(mockMessage);
    // Validate the functions in builtContext
  });

  // Test duplicate
  it("should create a duplicate of the context", () => {
    const context = new Context([mockMessage]);
    const duplicateContext = context.duplicate();
    expect(duplicateContext.messages).toEqual(context.messages);
    // Additional checks to ensure duplication
  });
});
