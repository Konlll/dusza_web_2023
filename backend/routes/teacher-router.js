import express from "express";

export const teacherRouter = express.Router();

teacherRouter.get("/", (req,res) => {
    res.send("teacher's site");
})
