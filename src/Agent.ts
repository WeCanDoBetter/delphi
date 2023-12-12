import type {
  BaseClientOptions,
  ChatMessage,
  ChatResponseMessage,
  FunctionCall,
} from "./types";
import type { Context } from "./Context";

export interface ClientOptions extends BaseClientOptions {
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
  /** The maximum number of rounds to run the agent. */
  maxRounds?: number;
}

export interface RunResult {
  /** The round. */
  round: number;
  /** The message. */
  message: ChatMessage;
  /** Whether the agent is done. */
  done: boolean;
}

/** The required agent options. */
type RequiredAgentOptions = Required<
  Omit<AgentOptions, "description" | "client">
>;

/** The agent options with the required options. */
type InstanceAgentOptions = RequiredAgentOptions & {
  /** The description of the agent. */
  description?: string;
  /** The client options. */
  client: ClientOptions;
};

/**
 * An agent. This is used to run an agent.
 */
export class Agent {
  /** The default agent options. */
  static DEFAULT_OPTIONS: RequiredAgentOptions = {
    maxRounds: 5,
  };

  /** The name of the agent. */
  readonly name: string;
  /** The description of the agent. */
  readonly description?: string;
  /** The options of the agent. */
  readonly options: InstanceAgentOptions;

  #client: ClientFunction;

  constructor(name: string, client: ClientFunction, options: AgentOptions) {
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
   * @param options.maxRounds The maximum number of rounds to run the agent.
   * @returns The result of the agent.
   */
  async *run(
    context: Context,
    { signal, maxRounds = this.options.maxRounds }: RunOptions = {},
  ): AsyncIterableIterator<RunResult> {
    const runRound = async (round: number): Promise<ChatMessage> => {
      const { messages, functions } = context.build();
      const isLastRound = round >= maxRounds!;
      const includeFunctions = !isLastRound && functions.length;

      return this.#client(messages, {
        ...this.options.client,
        functionCall: includeFunctions ? "auto" : "none",
        functions: includeFunctions ? undefined : functions,
      });
    };

    // Loop through the rounds, until the maximum number of rounds is reached
    for (let round = 1; round <= maxRounds; round++) {
      if (signal?.aborted) {
        // Abort the agent
        break;
      }

      // Run the round
      const message = await runRound(round);

      // Add the message to the context
      context.addMessage(message);

      // Yield the message
      yield {
        round,
        message,
        done: !(message as ChatResponseMessage).functionCall,
      };

      // Check again before processing the possible function call
      // This allows the agent to be aborted before processing the function
      if (signal?.aborted) {
        // Abort the agent
        break;
      }

      const { functionCall } = message as ChatResponseMessage;

      if (functionCall) {
        // Process the function call
        const result = await this.#processFunctionCall(context, functionCall);

        // Add the function result to the context
        context.addMessage(result);

        // Yield the function result
        yield {
          round,
          message: result,
          done: false,
        };
      }
    }
  }

  /**
   * Process a function call. This will run the function and add the result to
   * the context.
   * @param context The context to process the function call with.
   * @param functionCall The function call to process.
   * @returns The function result message.
   * @throws {Error} If the function does not exist or is not enabled.
   * @throws {AggregateError} If the function arguments are invalid or the
   * function throws an error.
   */
  async #processFunctionCall(
    context: Context,
    functionCall: FunctionCall,
  ): Promise<ChatMessage> {
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

    // Return the function result message
    return {
      role: "function",
      name: functionCall.name,
      content: typeof value === "string" ? value : JSON.stringify(value),
    };
  }
}
