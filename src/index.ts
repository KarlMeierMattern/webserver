import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/validate.js";

const app = express();
app.use(express.json()); // built-in middleware to parse JSON bodies
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app")); // express middleware that serves static files

// express app object takes a path and handler function
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

// admin routes
app.post("/admin/reset", handlerReset);
app.get("/admin/metrics", handlerMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Run the server and tee the output (copies the stdout) to a new file called server.log
// npm run dev | tee server.log
