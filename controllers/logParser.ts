import fs from "fs";
import readline from "readline";

export type LogEntry = {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err?: string;
};

export class LogParser {
  async parseLogFile(filePath: string): Promise<LogEntry[]> {
    const fileStream = fs.createReadStream(filePath);
    const lines = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const logEntries: LogEntry[] = [];
    for await (const line of lines) {
      const logEntry = this.parseLogLine(line);
      if (logEntry) {
        logEntries.push(logEntry);
      }
    }

    return logEntries;
  }

  // Make parseLogLine public to allow direct testing
  public parseLogLine(line: string): LogEntry | null {
    const regex = /^(?<date>.+?) - (?<level>.+?) - (?<json>{.+})$/;
    const match = line.match(regex);

    if (match && match.groups) {
      const { date, level, json } = match.groups;
      if (level === "error" || level === "warn") {
        const logData = JSON.parse(json);
        return {
          timestamp: new Date(date).getTime(),
          loglevel: level,
          transactionId: logData.transactionId,
          err: logData.err,
        };
      }
    }

    return null;
  }
}
