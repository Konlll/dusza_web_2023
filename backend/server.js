import express from "express";
import dotenv from "dotenv";
import { adminRouter } from "./routes/admin-router.js";
import { tasksRouter } from "./routes/tasks.js";
import { userActionRouter } from "./routes/user-action.js";
import { authRouter } from "./routes/auth.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

/* Middlewares */
app.use(express.json());

/* Routes */
app.use('/admin', adminRouter);
app.use("/tasks", tasksRouter);
app.use('/user', userActionRouter)
app.use("/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
