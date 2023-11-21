import type { BaseClientOptions, ChatMessage } from "./types";
import type { Context } from "./Context";

interface ClientOptions extends BaseClientOptions {
  /** The model to use. */
  model: string;
}

/**
 * A client function. This is used to run the agent.
 * @param messages The messages to run the agent with.
 * @param options The options to run the agent with.
 * @returns The result of the agent.
 */
export type ClientFunction = (
  messages: ChatMessage[],
  options: ClientOptions,
) => Promise<ChatMessage>;

export interface AgentOptions {
  /** The maximum number of rounds to run the agent (default: 5). */
  maxRounds?: number;
  /** The description of the agent. */
  description?: string;
  /** The client options. */
  client: Omit<ClientOptions, "functionCall" | "functions">;
}

export interface RunOptions {
  /** The abort signal. */
  signal?: AbortSignal;
}

/** The default agent options. */
type DefaultAgentOptions = Required<
  Omit<AgentOptions, "model" | "description" | "client">
>;

/**
 * An agent. This is used to run an agent.
 */
export class Agent extends EventTarget {
  /** The default agent options. */
  static DEFAULT_OPTIONS: DefaultAgentOptions = {
    maxRounds: 5,
  };

  /** The name of the agent. */
  readonly name: string;
  /** The description of the agent. */
  readonly description?: string;
  /** The options of the agent. */
  readonly options: AgentOptions;

  #client: ClientFunction;

  constructor(name: string, client: ClientFunction, options: AgentOptions) {
    super();
    this.name = name;
    this.#client = client;

    const { description } = options;
    delete options.description;
    this.description = description;

    this.options = { ...Agent.DEFAULT_OPTIONS, ...options };
  }

  /**
   * Run the agent.
   *
   * The agent may call zero or more functions. If a function is called, the
   * result of the function will be added to the context and the agent will be
   * called again. This will continue until the agent does not call any
   * functions, or the maximum number of rounds is reached.
   * @param context The context to run the agent with.
   * @param options The options to run the agent with.
   * @param options.signal The abort signal.
   * @returns The result of the agent.
   */
  async *run(
    context: Context,
    { signal }: RunOptions = {},
  ): AsyncIterableIterator<ChatMessage> {
    const runRound = async (round: number): Promise<ChatMessage> => {
      const { messages, functions } = context.build();
      const isLastRound = round >= this.options.maxRounds!;

      return this.#client(messages, {
        ...this.options.client,
        functionCall: isLastRound || !functions.length ? "none" : "auto",
        functions: isLastRound || !functions.length ? undefined : functions,
      });
    };

    // Loop through the rounds, until the maximum number of rounds is reached
    for (let round = 1; round <= this.options.maxRounds!; round++) {
      if (signal?.aborted) {
        // Abort the agent
        break;
      }

      // Run the round
      const message = await runRound(round);

      // Add the message to the context
      context.addMessage(message);

      // Yield the message
      yield message;

      // Process the function call
      const response = await this.#processFunctionCall(context, message);

      if (response) {
        // Add the function result to the context
        context.addMessage(response);

        // Yield the function result
        yield response;
      }
    }
  }

  /**
   * Process a function call. This will run the function and add the result to
   * the context. If there is no function call, this will do nothing.
   * @param context The context to process the function call with.
   * @param message The message to process the function call with.
   * @returns Whether the function call was processed. If so, the agent should
   * be called again, so it can process the function result. If not, message
   * is not a function call.
   * @throws {Error} If the function does not exist or is not enabled.
   * @throws {AggregateError} If the function arguments are invalid or the
   * function throws an error.
   */
  async #processFunctionCall(
    context: Context,
    message: ChatMessage,
  ): Promise<ChatMessage | null> {
    const { functionCall } = message;

    if (!functionCall) {
      return null;
    }

    // Get the function
    const fn = context.functions.get(functionCall.name);

    if (!fn) {
      throw new Error(`Function "${functionCall.name}" does not exist.`);
    } else if (!context.functions.isEnabled(functionCall.name)) {
      throw new Error(`Function "${functionCall.name}" is not enabled.`);
    }

    let args: unknown;

    try {
      // Attempt to parse the function arguments
      args = JSON.parse(functionCall.arguments);
    } catch (error: any) {
      throw new AggregateError(
        [error],
        "Failed to parse function arguments.",
      );
    }

    let value: unknown;

    try {
      // Run the function
      value = await fn.run(args);
    } catch (error: any) {
      throw new AggregateError([error], "Failed to run function.");
    }

    // Create the function result
    const result: ChatMessage = {
      role: "function",
      name: functionCall.name,
      content: typeof value === "string" ? value : JSON.stringify(value),
    };

    return result;
  }
}
