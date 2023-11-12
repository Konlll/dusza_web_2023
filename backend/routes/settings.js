import express from "express";
import prisma from "../db.js";
import {error_obj} "../server.js";

const settingsRouter = express.Router();
settingsRouter.put("/", async (req,res) => 
    {
       const result = await prisma.settings.update({
           data : {
               title : req.body.title,
               desc : req.body.desc
           }
       }) 
    })
