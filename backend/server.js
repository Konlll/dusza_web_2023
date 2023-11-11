import express from "express";
import dotenv from "dotenv";
import { adminRouter } from "./routes/admin-router.js";
import { tasksRouter } from "./routes/tasks.js";
import { userActionRouter } from "./routes/user-action.js";
import { authRouter } from "./routes/auth.js";
import { juryRouter } from "./routes/juryRouter.js";
import { activityRouter } from "./routes/activity.js";

dotenv.config();
const app = express();
const port =  process.env.PORT;

//global error object
let error_obj = {}
export { error_obj } ;
/* Middlewares */
app.use(express.json());

/* Routes */
app.use('/admin', adminRouter);
app.use("/tasks", tasksRouter);
app.use('/user', userActionRouter)
app.use("/auth", authRouter);
app.use("/jury", juryRouter);
app.use("/activity", activityRouter);
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get("/error", (req,res) => {
        return res.json(error_obj);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
