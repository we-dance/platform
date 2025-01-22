import dotenv from "dotenv";
import { ProviderFactory, ProviderType } from "./providers";
import { Logger } from "./utils/logger";
import readline from "readline";
import { randomUUID } from "crypto";

// Load environment variables
dotenv.config();

const CURRENT_PROVIDER = (process.env.LLM_PROVIDER as ProviderType) || "ollama";

// Initialize provider
const llmProvider = ProviderFactory.create(CURRENT_PROVIDER, {
  apiKey: process.env[`${CURRENT_PROVIDER.toUpperCase()}_API_KEY`],
  model: process.env[`${CURRENT_PROVIDER.toUpperCase()}_MODEL`],
  host: process.env.OLLAMA_HOST,
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Store conversation history
const history: Array<{ role: string; content: string }> = [];

// Generate a unique session ID for this CLI instance
const sessionId = `cli-${randomUUID()}`;

// Main chat loop
async function chat() {
  const { name, model } = llmProvider.getModelInfo();
  console.log(`\n🤖 Using ${name} (${model})`);
  console.log(
    'Type your message (or "exit" to quit, "clear" to reset history)\n'
  );

  // Function to handle user input
  async function askQuestion() {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      if (input.toLowerCase() === "clear") {
        history.length = 0;
        console.log("\n🧹 Conversation history cleared\n");
        askQuestion();
        return;
      }

      try {
        // Add user message to history
        history.push({ role: "user", content: input });
        Logger.log(sessionId, "cli-request", input);

        // Show thinking indicator
        process.stdout.write("Assistant: ");

        // Get response from LLM
        const response = await llmProvider.ask(history, sessionId);

        // Add assistant response to history
        history.push({ role: "assistant", content: response });
        Logger.log(sessionId, "cli-response", response);

        // Display response
        console.log(response);
        console.log(); // Empty line for readability
      } catch (error: any) {
        console.error("\n❌ Error:", error.message);
        if (error.getTroubleshooting) {
          console.log("\n🔍 Troubleshooting tips:");
          error.getTroubleshooting().forEach((tip: string) => {
            console.log(`• ${tip}`);
          });
        }
        console.log(); // Empty line for readability
      }

      // Continue the conversation
      askQuestion();
    });
  }

  // Start the conversation
  askQuestion();
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  // Single question mode
  const question = args.join(" ");
  history.push({ role: "user", content: question });
  Logger.log(sessionId, "cli-request", question);

  llmProvider
    .ask(history, sessionId)
    .then((response) => {
      Logger.log(sessionId, "cli-response", response);
      console.log(response);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      if (error.getTroubleshooting) {
        console.log("\nTroubleshooting tips:");
        error.getTroubleshooting().forEach((tip: string) => {
          console.log(`• ${tip}`);
        });
      }
      process.exit(1);
    });
} else {
  // Interactive mode
  chat();
}
