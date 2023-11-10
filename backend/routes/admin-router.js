import express from "express";

export const adminRouter = express.Router();

adminRouter.get("/", (req,res) => {
    res.send("teacher's site");
})

