import type { ErrorObject } from "ajv";

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
