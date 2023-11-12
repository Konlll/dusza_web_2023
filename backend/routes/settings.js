import express from "express";
import prisma from "../db.js";
import fs from "fs";
import { error_obj } from "../server.js";
import util from "util";
import { Authenticate } from "../authentication.js";
export const settingsRouter = express.Router();
settingsRouter.put("/", Authenticate("ADMIN"), async (req, res) => {
    /*const iconpath = util.promisify(fs.readFile)(req.body.icon, "binary")
    .then(data => Buffer.from(data.slice(0,1024)))
    .catch(err => res.status(500).send(err));*/

    const result = await prisma.settings.update({
        where:
        {
            id: 1
        },
        data: {
            title: req.body.title,
            desc: req.body.desc,
            icon: null //iconpath
        }
    })
    if (result == null) {
        error_obj.err = 404;
        return res.status(404);
    }
    res.status(200).json(result);
})
/*settingsRouter.post("/create", async (req,res) => 
    {  
        const iconpath = util.promisify(fs.readFile)(req.body.icon, "binary")
        .then(data => Buffer.from(data.slice(0,1024))
        .catch(err => res.status(500).send(err)));
        const new_settings = await prisma.settings.create({
           data : {
                   id: 1,
                   title : req.body.title,
                   desc : req.body.desc,
                   icon: iconpath
               }
            }
        )
        res.status(200).json(new_settings);
    });*/

settingsRouter.get("/", Authenticate("ADMIN"), async (req, res) => {
    const setting = await prisma.settings.findFirst({
        where:
        {
            id: 1
        }
    });
    if (setting == null) {
        error_obj.err = 404;
        return res.status(404);
    }
    res.status(200).json(setting);
});
