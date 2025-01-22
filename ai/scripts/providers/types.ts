import { Logger, LogMetadata } from "../utils/logger";
import Anthropic from "@anthropic-ai/sdk";

export interface HistoryMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<Anthropic.Messages.ContentBlockParam>;
}

export interface ModelInfo {
  name: string;
  model: string;
}

export interface ProviderConfig {
  apiKey: string;
  model: string;
  host?: string;
}

export interface ProcessedMessage {
  text?: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    input: any;
  }>;
}

export abstract class BaseLLMProvider {
  protected abstract name: string;
  protected abstract model: string;
  protected logger!: Logger;

  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  abstract ask(
    history: HistoryMessage[],
    sessionId: number | string
  ): Promise<ProcessedMessage>;

  protected abstract processResponse(response: any): ProcessedMessage;

  getModelInfo(): ModelInfo {
    return {
      name: this.name,
      model: this.model,
    };
  }

  protected logRequest(request: any, sessionId: number | string) {
    this.logger.log(
      sessionId,
      "llm-request",
      JSON.stringify(request, null, 2),
      {
        provider: this.name,
        model: this.model,
      }
    );
  }

  protected logResponse(
    response: any,
    sessionId: number | string,
    metadata?: LogMetadata
  ) {
    this.logger.log(
      sessionId,
      "llm-response",
      JSON.stringify(response, null, 2),
      {
        provider: this.name,
        model: this.model,
        ...metadata,
      }
    );
  }
}

export class LLMError extends Error {
  constructor(
    public provider: string,
    public errorType: "API_KEY" | "CONNECTION" | "TIMEOUT" | "UNKNOWN",
    message: string
  ) {
    super(message);
    this.name = "LLMError";
  }

  getTroubleshooting(): string[] {
    const tips: Record<string, string[]> = {
      API_KEY: [
        "Check if API key is set in .env file",
        "Verify API key is valid",
        "Ensure API key has proper permissions",
      ],
      CONNECTION: [
        "Check internet connection",
        "Verify API endpoint is accessible",
        "Check if service is running (for local providers)",
      ],
      TIMEOUT: [
        "Request took too long to complete",
        "Try again later",
        "Check if model is still loading (for local providers)",
      ],
      UNKNOWN: [
        "Check provider status page",
        "Review error logs for details",
        "Contact support if issue persists",
      ],
    };

    return tips[this.errorType] || tips.UNKNOWN;
  }
}
