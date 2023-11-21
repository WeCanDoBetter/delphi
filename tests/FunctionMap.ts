import { FunctionMap } from "../src/FunctionMap";
import { AgentFunction } from "../src/AgentFunction";
import type { JSONSchemaType } from "../src/types";

type TestInput = { n: number };
type TestOutput = { n: number };

describe("FunctionMap", () => {
  const schema: JSONSchemaType<TestInput> = {
    type: "object",
    properties: {
      n: { type: "number" },
    },
    required: ["n"],
    additionalProperties: false,
  };

  // Mock functions
  const mockFunction1 = new AgentFunction<TestInput, TestOutput>(
    "func1",
    "Test Function 1",
    schema,
    async ({ n }) => ({ n }),
  );

  const mockFunction2 = new AgentFunction<TestInput, TestOutput>(
    "func2",
    "Test Function 2",
    schema,
    async ({ n }) => ({ n }),
  );

  // Test constructor
  it("should initialize with provided functions", () => {
    const functionMap = new FunctionMap([mockFunction1, mockFunction2]);
    expect(functionMap.size).toBe(2);
    expect(functionMap.get("func1")).toBe(mockFunction1);
    expect(functionMap.get("func2")).toBe(mockFunction2);
  });

  // Test enabled getter
  it("should return an empty array for enabled functions initially", () => {
    const functionMap = new FunctionMap();
    expect(functionMap.enabled).toEqual([]);
  });

  // Test enable method
  it("should enable a function", () => {
    const functionMap = new FunctionMap([mockFunction1]);
    functionMap.enable("func1");
    expect(functionMap.enabled).toContain("func1");
  });

  it("should throw an error when trying to enable a non-existent function", () => {
    const functionMap = new FunctionMap();
    expect(() => functionMap.enable("nonExistentFunction")).toThrow(Error);
  });

  // Test enableAll method
  it("should enable all functions", () => {
    const functionMap = new FunctionMap([mockFunction1, mockFunction2]);
    functionMap.enableAll();
    expect(functionMap.enabled).toEqual(["func1", "func2"]);
  });

  // Test disable method
  it("should disable a function", () => {
    const functionMap = new FunctionMap([mockFunction1]);
    functionMap.enable("func1");
    functionMap.disable("func1");
    expect(functionMap.enabled).not.toContain("func1");
  });

  it("should throw an error when trying to disable a non-existent function", () => {
    const functionMap = new FunctionMap();
    expect(() => functionMap.disable("nonExistentFunction")).toThrow(Error);
  });

  // Test disableAll method
  it("should disable all functions", () => {
    const functionMap = new FunctionMap([mockFunction1, mockFunction2]);
    functionMap.enableAll();
    functionMap.disableAll();
    expect(functionMap.enabled).toEqual([]);
  });

  // Test build method
  it("should build function definitions for enabled functions", () => {
    const functionMap = new FunctionMap([mockFunction1, mockFunction2]);
    functionMap.enable("func2");
    const definitions = functionMap.build();
    expect(definitions.length).toBe(1);
    expect(definitions[0].name).toBe("func2");
    expect(definitions[0].description).toBe("Test Function 2");
  });
});
