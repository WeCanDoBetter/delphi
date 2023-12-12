import type { GetChatCompletionsOptions } from "@azure/openai";
import type { ChatRequestMessage, ChatResponseMessage } from "@azure/openai";

export type {
  ChatRequestMessage,
  ChatResponseMessage,
  FunctionCall,
  FunctionDefinition,
} from "@azure/openai";

/** The base client options. */
export type BaseClientOptions = Omit<
  GetChatCompletionsOptions,
  "stream" | "model" | "n"
>;

export type { JSONSchemaType } from "ajv";
export type ChatMessage = ChatRequestMessage | ChatResponseMessage;
