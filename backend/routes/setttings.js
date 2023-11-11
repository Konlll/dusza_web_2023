import prisma from "../db.js";
import { error_obj} from "../server.js";
import express from "express";
import fs from "fs";
const settingsRouter = express.Router();

settingsRouter.put("/", async (req,res) => 
    {
        const {title, desc, icon} = req.body;

        //readFileAsync ??
        
        const iconpath = fs.readFileSync(icon)
        const settings = await prisma.settings.update({
            data : 
            {
                title : title,
                desc : desc,
                icon : iconpath
            }
        })
        if(settings != null)  
        {
            error_obj.err = 500;
            return res.status(500);
        }
        res.status(200);
    })
