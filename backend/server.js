import express from "express";
import dotenv from "dotenv";
import { teacherRouter } from "./routes/teacher-router.js";
import { adminRouter } from "./routes/admin-router.js";
import { tasksRouter } from "./routes/tasks.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

/* Middlewares */
app.use(express.json());

/* Routes */
app.use('/teacher', teacherRouter);
app.use('/admin', adminRouter);
app.use("/tasks", tasksRouter);


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/login', (req, res) => {
  //TODO: handle login
  const { username, password } = req.body;
  res.send(username, password);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});