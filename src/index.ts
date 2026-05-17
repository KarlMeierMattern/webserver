import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  middlewareErrorHandler,
} from "./middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateUser } from "./api/users.js";
import { handlerValidateChirp } from "./api/validate.js";
import {
  handlerCreateChirp,
  handlerGetChirps,
  handlerGetChirp,
} from "./api/chirps.js";
import { config } from "./config.js";

// Ensures the database will be up-to-date whenever you start the server.
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.use(express.json()); // built-in middleware to parse JSON bodies

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app")); // express middleware that serves static files

// Route handlers for API endpoints
// express app object takes a path and handler function
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);
app.post("/api/users", handlerCreateUser);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirp);

// admin routes
app.post("/admin/reset", handlerReset);
app.get("/admin/metrics", handlerMetrics);

// Error handler middleware should be added after all other routes and middleware
app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});

// Run the server and tee the output (copies the stdout) to a new file called server.log
// npm run dev | tee server.log
