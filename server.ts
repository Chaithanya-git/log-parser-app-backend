// src/server.ts
import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes/routes";

const app = express();
const port = 3000;
app.use(cors());

registerRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
