import fs from "fs";
import path from "path";

interface UserInfo {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  app?: string;
}

export type LogType =
  | "user"
  | "system"
  | "llm-request"
  | "llm-response"
  | "bot-response"
  | "tool-execution"
  | "cli-request"
  | "cli-response";

export interface LogMetadata {
  provider?: string;
  model?: string;
  [key: string]: any;
}

export class Logger {
  private static LOG_DIR = "logs";
  private user: UserInfo;
  private initialized: boolean = false;

  constructor(user: UserInfo) {
    this.user = user;
    this.initialize();
  }

  private initialize() {
    if (!this.initialized) {
      if (!fs.existsSync(Logger.LOG_DIR)) {
        fs.mkdirSync(Logger.LOG_DIR);
      }
      this.initialized = true;
    }
  }

  private getLogPath(type: LogType): string {
    const date = new Date();
    const username = this.user?.username || String(this.user.id);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    // Create directory structure
    const dirPath = path.join(Logger.LOG_DIR, username, dateStr);
    fs.mkdirSync(dirPath, { recursive: true });

    // Return full file path with type as filename
    return path.join(dirPath, `${type}.log`);
  }

  log(
    sessionId: string | number,
    type: LogType,
    content: string,
    metadata?: LogMetadata
  ) {
    const timestamp = new Date().toISOString();
    const logPath = this.getLogPath(type);

    let logEntry = `[${timestamp}] Session ID: ${sessionId}\n`;

    if (metadata) {
      logEntry += `Metadata: ${JSON.stringify(metadata, null, 2)}\n`;
    }

    logEntry += `Content: ${content}\n`;
    logEntry += "----------------------------------------\n";

    // Use synchronous write to avoid race conditions
    fs.appendFileSync(logPath, logEntry);
  }
}
