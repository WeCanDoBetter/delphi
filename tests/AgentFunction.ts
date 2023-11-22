import { AgentFn, AgentFunction } from "../src/AgentFunction";
import { JSONSchemaType } from "../src/types";

describe("AgentFunction", () => {
  // Mock data for input and output
  interface Input {
    value: string;
  }

  interface Output {
    result: string;
  }

  const inputSchema: JSONSchemaType<Input> = {
    type: "object",
    properties: {
      value: { type: "string" },
    },
    required: ["value"],
  };

  const validInput: Input = { value: "test" };
  const invalidInput = { value: 123 }; // Invalid as per schema
  const output: Output = { result: "processed" };

  // Mock AgentFn function
  const mockFn: AgentFn<Input, Output> = async () => {
    return output;
  };

  // Test constructor
  it("should initialize with provided values", () => {
    const agentFunction = new AgentFunction({
      name: "testFunction",
      description: "A test function",
      schema: inputSchema,
      fn: mockFn,
    });
    expect(agentFunction.name).toBe("testFunction");
    expect(agentFunction.description).toBe("A test function");
    expect(agentFunction.schema).toBe(inputSchema);
  });

  // Test run method
  describe("run", () => {
    it("should run successfully with valid input", async () => {
      const agentFunction = new AgentFunction({
        name: "testFunction",
        description: "A test function",
        schema: inputSchema,
        fn: mockFn,
      });
      await expect(agentFunction.run(validInput)).resolves.toEqual(output);
    });

    it("should throw an error for invalid input", async () => {
      const agentFunction = new AgentFunction({
        name: "testFunction",
        description: "A test function",
        schema: inputSchema,
        fn: mockFn,
      });
      await expect(agentFunction.run(invalidInput as unknown as Input)).rejects
        .toThrow(Error);
    });

    it("should throw an error if the function throws", async () => {
      const failingFn: AgentFn<Input, Output> = async () => {
        throw new Error("Function failed");
      };
      const agentFunction = new AgentFunction({
        name: "testFunction",
        description: "A test function",
        schema: inputSchema,
        fn: failingFn,
      });
      await expect(agentFunction.run(validInput)).rejects.toThrow(Error);
    });
  });
});
