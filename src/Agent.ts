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
  client: ClientOptions;
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
   * @param round The round for this call.
   * @returns The result of the agent.
   */
  async run(context: Context, round = 1): Promise<ChatMessage> {
    const { messages, functions } = context.build();
    const { model } = this.options.client;
    const isLastRound = round === this.options.maxRounds!;

    const message = await this.#client(messages, {
      model,
      functionCall: isLastRound ? "none" : functions.length ? "auto" : "none",
      functions: isLastRound ? functions : undefined,
    });

    const { functionCall } = message;

    context.addMessage(message);

    if (functionCall) {
      const fn = context.functions.get(functionCall.name);

      if (!fn) {
        throw new Error(`Function "${functionCall.name}" does not exist.`);
      } else if (!context.functions.enabled.includes(functionCall.name)) {
        throw new Error(`Function "${functionCall.name}" is not enabled.`);
      }

      let args: unknown;

      try {
        args = JSON.parse(functionCall.arguments);
      } catch (error: any) {
        throw new AggregateError(
          [error],
          "Failed to parse function arguments.",
        );
      }

      let value: unknown;

      try {
        value = await fn.run(args);
      } catch (error: any) {
        throw new AggregateError([error], "Failed to run function.");
      }

      context.addMessage({
        role: "function",
        name: functionCall.name,
        content: typeof value === "string" ? value : JSON.stringify(value),
      });

      // Run the agent again with the updated context
      return this.run(context, round++);
    }

    return message;
  }
}
