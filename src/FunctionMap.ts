import type { FunctionDefinition } from "./types";
import type { AgentFunction } from "./AgentFunction";

/**
 * A function map. This is used to store functions that can be called by the
 * agent. The functions can be enabled or disabled.
 */
export class FunctionMap extends Map<string, AgentFunction<any, any>> {
  #enabled: string[] = [];

  constructor(functions?: Iterable<AgentFunction<any, any>>) {
    super();

    if (functions) {
      for (const fn of functions) {
        this.set(fn.name, fn);
        this.#enabled.push(fn.name);
      }
    }
  }

  /**
   * The names of the enabled functions.
   */
  get enabled(): ReadonlyArray<string> {
    return this.#enabled;
  }

  /**
   * Add a function. If the function is enabled, it will be added to the list of
   * enabled functions.
   * @param fn The function to add.
   * @param enabled Whether to enable the function (default: `true`).
   * @throws {Error} If a function with the same name already exists.
   */
  addFunction<Input, Output>(fn: AgentFunction<Input, Output>, enabled = true) {
    if (this.has(fn.name)) {
      throw new Error(`Function "${fn.name}" already exists.`);
    }

    this.set(fn.name, fn);

    if (enabled) {
      this.#enabled.push(fn.name);
    }
  }

  /**
   * Enable a function.
   * @param nameOrFn The name of the function or the function itself.
   */
  enable(name: string): void;
  enable(fn: AgentFunction<any, any>): void;
  enable(nameOrFn: string | AgentFunction<any, any>) {
    const name = typeof nameOrFn === "string" ? nameOrFn : nameOrFn.name;

    if (!this.has(name)) {
      throw new Error(`Function "${name}" does not exist.`);
    } else if (!this.#enabled.includes(name)) {
      this.#enabled.push(name);
    }
  }

  /**
   * Check if a function is enabled.
   * @param nameOrFn The name of the function or the function itself.
   * @throws {Error} If the function does not exist.
   */
  isEnabled(name: string) {
    if (!this.has(name)) {
      throw new Error(`Function "${name}" does not exist.`);
    }

    return this.#enabled.includes(name);
  }

  /**
   * Enable all functions.
   */
  enableAll() {
    this.#enabled = [...this.keys()];
  }

  /**
   * Disable a function.
   * @param nameOrFn The name of the function or the function itself.
   */
  disable(name: string): void;
  disable(fn: AgentFunction<any, any>): void;
  disable(nameOrFn: string | AgentFunction<any, any>) {
    const name = typeof nameOrFn === "string" ? nameOrFn : nameOrFn.name;

    if (!this.has(name)) {
      throw new Error(`Function "${name}" does not exist.`);
    } else if (this.#enabled.includes(name)) {
      this.#enabled = this.#enabled.filter((n) => n !== name);
    }
  }

  /**
   * Disable all functions.
   */
  disableAll() {
    this.#enabled = [];
  }

  /**
   * Build the function definitions.
   */
  build(): FunctionDefinition[] {
    return this.#enabled.map((name) => {
      const { description, schema } = this.get(name)!;
      return { name, description, schema };
    });
  }
}
