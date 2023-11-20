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
   * Enable a function.
   * @param name The name of the function to enable.
   */
  enable(name: string) {
    if (!this.has(name)) {
      throw new Error(`Function "${name}" does not exist.`);
    } else if (!this.#enabled.includes(name)) {
      this.#enabled.push(name);
    }
  }

  /**
   * Enable all functions.
   */
  enableAll() {
    this.#enabled = [...this.keys()];
  }

  /**
   * Disable a function.
   * @param name The name of the function to disable.
   */
  disable(name: string) {
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
