// src/routes.ts
import { Application } from "express";
import multer from "multer";
import { LogParser } from "../controllers/logParser";

export function registerRoutes(app: Application) {
  const upload = multer({ dest: "uploads/" });
  const logParser = new LogParser();

  app.post("/parse-logs", upload.single("logFile"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const logEntries = await logParser.parseLogFile(req.file.path);
      res.json(logEntries);
    } catch (error) {
      res.status(500).send("Error parsing log file.");
    }
  });
}
