import express from "express";
import prisma from "../db.js";
import fs from "fs";
import {error_obj} from "../server.js";
import util from "util";
export const settingsRouter = express.Router();
settingsRouter.put("/", async (req,res) => 
    {
        const iconpath = util.promisify(fs.readFile)(req.body.icon, "binary")
        .then(data => Buffer.from(data.slice(0,1024)))
        .catch(err => res.status(500).send(err));

       const result = await prisma.settings.update({
           where : 
           {
                id : 1
           },       
           data : {
               title : req.body.title,
               desc : req.body.desc,
               icon : iconpath
           }
        })
        if(result == null) 
        {
            error_obj.err = 404;
            return res.status(404);
        }
        res.status(200).json(result);
    })

settingsRouter.get("/", async (req,res) => 
    {
        const setting =  await prisma.settings.findFirst({
            where: 
            {
                id: 1
            }
        });
        if (result == null) 
        {
            error_obj.err = 404;
            return res.status(404);
        }
        res.status(200).json(setting);
    });
