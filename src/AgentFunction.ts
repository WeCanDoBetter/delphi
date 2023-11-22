import Ajv, { type JSONSchemaType, type ValidateFunction } from "ajv";
import { ValidationError } from "./errors";

// Ajv instance.
const ajv = new Ajv();

/**
 * An agent function. This is a function that can be called by the agent.
 */
export type AgentFn<Input, Output> = (value: Input) => Promise<Output>;

export interface AgentFunctionOptions<Input, Output> {
  /** The name of the function. */
  name: string;
  /** The description of the function. */
  description: string;
  /** The schema of the function input. */
  schema: JSONSchemaType<Input>;
  /** The function. */
  fn: AgentFn<Input, Output>;
}

/**
 * An agent function. This is a function that can be called by the agent.
 */
export class AgentFunction<Input, Output> {
  /** The name of the function. */
  readonly name: string;
  /** The description of the function. */
  readonly description: string;
  /** The schema of the function input. */
  readonly schema: JSONSchemaType<Input>;

  #validate?: ValidateFunction<Input>;
  #fn: AgentFn<Input, Output>;

  constructor(options: AgentFunctionOptions<Input, Output>) {
    const { name, description, schema, fn } = options;

    this.name = name;
    this.description = description;
    this.schema = schema;
    this.#fn = fn;
  }

  /**
   * Validate the input. This will compile the schema if it has not already
   * been compiled.
   *
   * **Note**: This does not need to be called before calling `run`. It is
   * called automatically.
   * @param value The input to validate.
   * @throws {AggregateError} If the input is invalid.
   */
  validate(value: unknown) {
    if (!this.#validate) {
      this.#validate = ajv.compile(this.schema);
    }

    if (!this.#validate(value)) {
      throw new ValidationError(this.#validate.errors ?? []);
    }
  }

  /**
   * Run the function.
   * @param value The input to the function.
   * @returns The output of the function.
   * @throws {AggregateError} If the input is invalid.
   * @throws {AggregateError} If the function throws an error.
   */
  async run(value: Input): Promise<Output> {
    this.validate(value);

    try {
      return await this.#fn(value);
    } catch (error: any) {
      throw new AggregateError([error], "Failed to run function.");
    }
  }
}
