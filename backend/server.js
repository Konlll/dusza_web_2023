import express from "express";
import dotenv from "dotenv";
import { adminRouter } from "./routes/admin-router.js";
import { tasksRouter } from "./routes/tasks.js";
import { userActionRouter } from "./routes/user-action.js";
import { authRouter } from "./routes/auth.js";
import { competitionRouter } from "./routes/competitions.js";
import { activityRouter } from "./routes/activity.js";
import {settingsRouter} from "./routes/settings.js";
dotenv.config();
const app = express();
const port =  process.env.PORT;

//global error object
var error_obj = 
    {
        err : 0
    }; 
export { error_obj } ;
/* Middlewares */
app.use(express.json());

/* Routes */
app.use('/admin', adminRouter);
app.use("/tasks", tasksRouter);
app.use('/user', userActionRouter)
app.use("/auth", authRouter);
app.use("/competitions", competitionRouter);
app.use("/activity", activityRouter);
app.use("/settings", settingsRouter);

app.get("/error", (req,res) => {
        return res.send(error_obj);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
