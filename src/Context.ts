import type { ChatMessage, FunctionDefinition } from "./types";
import { FunctionMap } from "./FunctionMap";
import type { AgentFunction } from "./AgentFunction";

/**
 * A built context. This can be used with the OpenAI API.
 */
export interface BuiltContext {
  /** The messages in the context. */
  messages: ChatMessage[];
  /** The function definitions in the context. */
  functions: FunctionDefinition[];
}

/**
 * Context options.
 */
export interface ContextOptions {
  /** The messages in the context. */
  messages?: ChatMessage[];
  /** The functions in the context. */
  functions?: IterableIterator<AgentFunction<any, any>>;
}

/**
 * A context. This is used to store messages and functions that can be called
 * by the agent.
 */
export class Context {
  #messages: ChatMessage[];
  #functions: FunctionMap;

  constructor(options: ContextOptions = {}) {
    const { messages = [], functions } = options;

    this.#messages = messages;
    this.#functions = new FunctionMap(functions);
  }

  /**
   * The messages in the context.
   */
  get messages(): ReadonlyArray<ChatMessage> {
    return this.#messages;
  }

  /**
   * The functions in the context.
   */
  get functions(): FunctionMap {
    return this.#functions;
  }

  /**
   * Add a message to the context.
   * @param message The message to add.
   */
  addMessage(message: ChatMessage) {
    this.#messages.push(message);
  }

  /**
   * Add a function to the context.
   * @param fn The function to add.
   * @param enabled Whether to enable the function (default: `true`).
   * @throws {Error} If a function with the same name already exists.
   */
  addFunction<Input, Output>(fn: AgentFunction<Input, Output>, enabled = true) {
    if (this.#functions.has(fn.name)) {
      throw new Error(`Function "${fn.name}" already exists.`);
    }

    this.#functions.addFunction(fn, enabled);
  }

  /**
   * Build the context.
   * @returns The built context for use with the OpenAI API.
   */
  build(): BuiltContext {
    return {
      messages: this.#messages,
      functions: this.#functions.build(),
    };
  }

  /**
   * Create a duplicate of the context.
   * @returns A duplicate of the context.
   */
  duplicate(): Context {
    return new Context({
      messages: [...this.#messages],
      functions: this.#functions.values(),
    });
  }
}
