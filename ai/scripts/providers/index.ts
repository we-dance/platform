import { ClaudeProvider } from "./claude";
import { OpenAIProvider } from "./openai";
import { BaseLLMProvider, ProviderConfig } from "./types";

export type ProviderType = "openai" | "claude" | "ollama";

export class ProviderFactory {
  static create(type: ProviderType, config: ProviderConfig): BaseLLMProvider {
    switch (type) {
      case "claude":
        return new ClaudeProvider(config);
      case "openai":
        return new OpenAIProvider(config);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
}

// Export everything
export * from "./types";
export { ClaudeProvider } from "./claude";
export { OpenAIProvider } from "./openai";
