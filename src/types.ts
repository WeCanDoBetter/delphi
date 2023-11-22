import type { GetChatCompletionsOptions } from "@azure/openai";

export type {
  ChatMessage,
  FunctionCall,
  FunctionDefinition,
} from "@azure/openai";

/** The base client options. */
export type BaseClientOptions = Omit<
  GetChatCompletionsOptions,
  "stream" | "model" | "n"
>;

export type { JSONSchemaType } from "ajv";
