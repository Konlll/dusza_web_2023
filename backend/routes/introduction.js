import express from "express";
import prisma from "../db.js"
import {error_obj} from "../server.js";
import { Authenticate } from "../authentication.js";
export const introRouter = express.Router();
introRouter.get("/", async (req,res) => 
    {
        const introduction_details = await prisma.intro.findFirst();
        if (introduction_details == null) 
        {
            error_obj.err = 404;
            return res.status(404);
        }
        return res.status(200).json(introduction_details);
    });
introRouter.put("/update", Authenticate(["ADMIN"]), async (req,res) => 
    {
        const {text} = req.body
        const updated_intro = await prisma.intro.update(
            {
                where: 
                {
                    id : 1
                },
                data: 
                {
                    text : text
                }
            });
        if(updated_intro == null) 
        {
            error_obj.err = 500;
            return res.json({error : "internal server error"});
        }
        res.json(updated_intro);
})

/*
introRouter.post("/file", upload.single("file"), (req, res) => 
    {
        return res.json({file : req.file});
    })
*/
