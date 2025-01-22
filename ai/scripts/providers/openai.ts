import OpenAI from "openai";
import {
  BaseLLMProvider,
  HistoryMessage,
  ProviderConfig,
  LLMError,
  ProcessedMessage,
} from "./types";
import { toolDefinitions } from "../tools";

export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;
  protected name = "openai";
  protected model: string;
  protected tools: any[];

  constructor(config: ProviderConfig) {
    super();
    if (!config.apiKey) {
      throw new LLMError(
        this.name,
        "API_KEY",
        "OpenAI API key not set in environment"
      );
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.host,
    });

    this.model = config.model;

    // Transform tools to OpenAI format
    this.tools = toolDefinitions.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input_schema,
      },
    }));
  }

  async ask(
    history: HistoryMessage[],
    sessionId: number | string
  ): Promise<ProcessedMessage> {
    try {
      const systemPrompt = String(
        history.find((msg) => msg.role === "system")?.content || ""
      );

      const messages: OpenAI.ChatCompletionMessageParam[] = history
        .filter((msg) => msg.role !== "system")
        .map((msg) => {
          if (msg.role === "assistant") {
            return {
              role: "assistant",
              content: Array.isArray(msg.content)
                ? msg.content
                    .map((block) => {
                      if (block.type === "text") return block.text;
                      if (block.type === "tool_use") {
                        return `Using tool: ${block.name} with input: ${JSON.stringify(block.input)}`;
                      }
                      return "";
                    })
                    .join("\n")
                : String(msg.content),
            } as const;
          }
          return {
            role: "user",
            content: Array.isArray(msg.content)
              ? msg.content
                  .map((block) => {
                    if (block.type === "tool_result") {
                      return `Tool result: ${JSON.stringify(block.content)}`;
                    }
                    return String(block);
                  })
                  .join("\n")
              : String(msg.content),
          } as const;
        });

      const request: OpenAI.ChatCompletionCreateParamsNonStreaming = {
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt } as const,
          ...messages,
        ],
        tools: this.tools,
      };

      this.logRequest(request, sessionId);

      const response = await this.client.chat.completions.create(request);

      // Log the raw response for debugging
      this.logResponse(
        {
          id: response.id,
          model: response.model,
          choices: response.choices.map((choice) => ({
            message: {
              role: choice.message.role,
              content: choice.message.content,
              tool_calls: choice.message.tool_calls?.map((tool) => ({
                id: tool.id,
                type: tool.type,
                function: {
                  name: tool.function.name,
                  arguments: tool.function.arguments,
                },
              })),
            },
            finish_reason: choice.finish_reason,
          })),
        },
        sessionId
      );

      return this.processResponse(response);
    } catch (error: any) {
      throw new LLMError(
        this.name,
        "UNKNOWN",
        `OpenAI API error: ${error.message}`
      );
    }
  }

  protected processResponse(
    response: OpenAI.Chat.ChatCompletion
  ): ProcessedMessage {
    const message = response.choices[0].message;
    const result: ProcessedMessage = {};

    // Handle text content
    if (message.content) {
      result.text = message.content;
    }

    // Handle tool calls
    if (message.tool_calls?.length) {
      result.toolCalls = message.tool_calls.map((tool) => ({
        id: tool.id,
        name: tool.function.name,
        input: JSON.parse(tool.function.arguments),
      }));
    }

    return result;
  }
}
