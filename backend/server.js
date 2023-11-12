import dotenv from "dotenv";
import express from "express";
import { activityRouter } from "./routes/activity.js";
import { adminRouter } from "./routes/admin-router.js";
import { authRouter } from "./routes/auth.js";
import { competitionRouter } from "./routes/competitions.js";
import { gameRouter } from "./routes/game.js";
import { introRouter } from "./routes/introduction.js";
import { settingsRouter } from "./routes/settings.js";
import { tasksRouter } from "./routes/tasks.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//global error object
var error_obj =
{
  err: 0
};
export { error_obj };

/* Middlewares */
app.use(express.json());

/* Routes */
app.use('/admin', adminRouter);
app.use("/tasks", tasksRouter);
app.use("/auth", authRouter);
app.use("/competitions", competitionRouter);
app.use("/activity", activityRouter);
app.use("/settings", settingsRouter);
app.use("/intro", introRouter);
app.use("/game", gameRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get("/error", (req, res) => {
  return res.send(error_obj);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
