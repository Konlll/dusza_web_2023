import express from "express";
import prisma from "../db.js"
import fileupload from "express-fileupload";
import {error_obj} from "../server.js";
export const introRouter = express.Router();
introRouter.use(fileupload({createParentPath : true}))
introRouter.get("/", async (req,res) => 
    {
        const introduction_details = await prisma.intro.findFirst();
        if (introduction_details == null) 
        {
            return res.status(404);
        }
        return res.status(200).json(introduction_details);
    });
introRouter.put("/update",fileupload({createParentPath : true}) ,async (req,res) => 
    {
        const updated_intro = await prisma.intro.update(
            {
                data: 
                {
                    text : req.body.text
                }
            })
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
