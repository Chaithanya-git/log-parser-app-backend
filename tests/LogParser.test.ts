import { LogParser } from "../controllers/logParser";

describe("LogParser", () => {
  const logParser = new LogParser();

  it("should parse a log line with error level", () => {
    const logLine =
      '2021-08-09T02:12:51.259Z - error - {"transactionId":"1234","details":"Error occurred","err":"Not found"}';
    const parsed = logParser["parseLogLine"](logLine);
    expect(parsed).toEqual({
      timestamp: new Date("2021-08-09T02:12:51.259Z").getTime(),
      loglevel: "error",
      transactionId: "1234",
      err: "Not found",
    });
  });

  it("should return null for non-error/warn log levels", () => {
    const logLine =
      '2021-08-09T02:12:51.259Z - info - {"transactionId":"1234","details":"Service started"}';
    const parsed = logParser["parseLogLine"](logLine);
    expect(parsed).toBeNull();
  });

  it("should ignore non-error and non-warn log levels", () => {
    const infoLogLine =
      '2021-08-09T02:12:51.259Z - info - {"transactionId":"1234","details":"Service started"}';
    const debugLogLine =
      '2021-08-09T02:12:51.260Z - debug - {"transactionId":"1234","details":"Debugging info"}';
    expect(logParser.parseLogLine(infoLogLine)).toBeNull();
    expect(logParser.parseLogLine(debugLogLine)).toBeNull();
  });

  it("should handle malformed log lines gracefully", () => {
    const malformedLogLine = "This is not a valid log line";
    expect(logParser.parseLogLine(malformedLogLine)).toBeNull();
  });

  it("should handle log lines with missing fields", () => {
    const missingFieldLogLine =
      '2021-08-09T02:12:51.259Z - error - {"transactionId":"1234"}';
    const parsed = logParser.parseLogLine(missingFieldLogLine);
    expect(parsed).toEqual({
      timestamp: new Date("2021-08-09T02:12:51.259Z").getTime(),
      loglevel: "error",
      transactionId: "1234",
      err: undefined,
    });
  });

  it("should handle invalid JSON in log lines", () => {
    const invalidJsonLogLine =
      "2021-08-09T02:12:51.259Z - error - This is not JSON";
    expect(logParser.parseLogLine(invalidJsonLogLine)).toBeNull();
  });
});
