import type { ChatMessage, FunctionDefinition } from "./types";
import { FunctionMap } from "./FunctionMap";
import { AgentFunction } from "./AgentFunction";

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
   * Add multiple messages to the context.
   * @param messages The messages to add.
   */
  addMessages(...messages: ChatMessage[]) {
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  /**
   * Add a message at a specific index in the context.
   * @param index The index to add the message at.
   * @param message The message to add.
   * @throws {RangeError} If the index is out of range.
   */
  addMessageAt(index: number, message: ChatMessage) {
    if (index < 0 || index > this.#messages.length) {
      throw new RangeError("Index out of range");
    }

    this.#messages.splice(index, 0, message);
  }

  /**
   * Add multiple messages at a specific index in the context.
   * @param index The index to add the messages at.
   * @param messages The messages to add.
   * @throws {RangeError} If the index is out of range.
   */
  addMessagesAt(index: number, ...messages: ChatMessage[]) {
    if (index < 0 || index > this.#messages.length) {
      throw new RangeError("Index out of range");
    }

    this.#messages.splice(index, 0, ...messages);
  }

  /**
   * Replace a message in the context.
   * @param original The message to replace.
   * @param replacement The message to replace it with.
   * @throws {Error} If the message to replace is not found in the context.
   */
  replaceMessage(original: ChatMessage, replacement: ChatMessage) {
    const index = this.#messages.indexOf(original);

    if (index === -1) {
      throw new Error("Message not found in context");
    }

    this.#messages[index] = replacement;
  }

  /**
   * Add a function to the context.
   * @param fn The function to add.
   * @param enabled Whether to enable the function (default: `true`).
   * @throws {Error} If a function with the same name already exists.
   */
  addFunction<Input, Output>(fn: AgentFunction<Input, Output>, enabled = true) {
    this.#functions.addFunction(fn, enabled);
  }

  /**
   * Add multiple functions to the context.
   * @param fns The functions to add.
   */
  addFunctions<Input, Output>(
    ...fns: (AgentFunction<Input, Output> | {
      fn: AgentFunction<Input, Output>;
      enabled?: boolean;
    })[]
  ) {
    this.#functions.addFunctions(...fns);
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
      messages: [...this.#messages].map((message) => structuredClone(message)),
      functions: this.#functions.values(),
    });
  }
}
