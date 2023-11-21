import { Agent } from "../src/Agent";
import { Context } from "../src/Context";
import type { ChatMessage } from "../src/types";

const mockClientFunction = jest.fn();

describe("Agent", () => {
  let agent: Agent;
  let mockContext: Context;

  beforeEach(() => {
    agent = new Agent("test-agent", mockClientFunction, {
      client: { model: "gpt-3" },
      maxRounds: 3,
    });
    mockContext = new Context();
    mockClientFunction.mockReset();
  });

  it("should run for the maximum number of rounds", async () => {
    mockClientFunction.mockResolvedValueOnce({
      content: "response 1",
      role: "system",
    })
      .mockResolvedValueOnce({ content: "response 2", role: "system" })
      .mockResolvedValueOnce({ content: "response 3", role: "system" });

    const messages: ChatMessage[] = [];
    for await (const message of agent.run(mockContext)) {
      messages.push(message);
    }

    expect(messages).toHaveLength(3);
    expect(messages.map((m) => m.content)).toEqual([
      "response 1",
      "response 2",
      "response 3",
    ]);
    expect(mockClientFunction).toHaveBeenCalledTimes(3);
  });

  it("should abort running when signaled", async () => {
    const abortController = new AbortController();
    mockClientFunction.mockResolvedValue({
      content: "response",
      role: "system",
    });

    const messageIterator = agent.run(mockContext, {
      signal: abortController.signal,
    });
    const messagePromise = messageIterator.next();
    abortController.abort();

    const { value, done } = await messagePromise;
    expect(value).toEqual({ content: "response", role: "system" });
    expect(done).toBe(false);
    expect(mockClientFunction).toHaveBeenCalledTimes(1);
  });

  it("should process function calls correctly", async () => {
    mockClientFunction
      .mockResolvedValueOnce({
        content: "question",
        role: "system",
        functionCall: { name: "fetchData", arguments: "{}" },
      })
      .mockResolvedValueOnce({ content: "data", role: "function" });

    const messages: ChatMessage[] = [];
    for await (const message of agent.run(mockContext)) {
      messages.push(message);
    }

    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe("question");
    expect(messages[1].content).toBe("data");
    expect(mockClientFunction).toHaveBeenCalledTimes(2);
  });
});
