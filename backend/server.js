import express from "express";
import dotenv from "dotenv";
import { teacherRouter } from "./routes/teacher-router.js";
import {adminRouter} from "./routes/admin-router.js";
dotenv.config();
const app = express();
const port = process.env.PORT;

/* Routes */
app.use('/teacher',teacherRouter);
app.use('/admin', adminRouter);

/* Middlewares */
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/login', (req,res) => {
    //TODO: handle login
    const {username, password} = req.body;
    res.send(username,password);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});