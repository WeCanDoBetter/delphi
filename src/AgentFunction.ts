import Ajv, {
  type AsyncValidateFunction,
  type ErrorObject,
  type JSONSchemaType,
} from "ajv";

const ajv = new Ajv();

/**
 * A validation error which contains the validation errors.
 */
export class ValidationError extends Error {
  /** The validation errors. */
  readonly errors: ReadonlyArray<ErrorObject>;

  constructor(errors: ErrorObject[], message = "Invalid input.") {
    super(message);
    this.errors = errors;
  }
}

/**
 * An agent function. This is a function that can be called by the agent.
 */
export type AgentFn<Input, Output> = (value: Input) => Promise<Output>;

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

  #validate?: AsyncValidateFunction<Input>;
  #fn: AgentFn<Input, Output>;

  constructor(
    name: string,
    description: string,
    schema: JSONSchemaType<Input>,
    fn: AgentFn<Input, Output>,
  ) {
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
   * @returns The validated input.
   * @throws {AggregateError} If the input is invalid.
   */
  async validate(value: Input): Promise<Input> {
    if (!this.#validate) {
      this.#validate = await ajv.compileAsync<Input & { $async: true }>({
        ...this.schema,
        $async: true,
      });
    }

    const result = await this.#validate(value);

    if (!result) {
      throw new ValidationError(this.#validate.errors ?? []);
    }

    return result;
  }

  /**
   * Run the function.
   * @param value The input to the function.
   * @returns The output of the function.
   * @throws {AggregateError} If the input is invalid.
   * @throws {AggregateError} If the function throws an error.
   */
  async run(value: Input): Promise<Output> {
    const input = await this.validate(value);

    try {
      return await this.#fn(input);
    } catch (error: any) {
      throw new AggregateError([error], "Failed to run function.");
    }
  }
}
