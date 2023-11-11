import express from "express";
import prisma from "../db.js";
import { Authenticate, HashPassword } from "../authentication.js";
export const adminRouter = express.Router();
import {error_obj} from "../server.js";


/**
 * Gets all users (teachers, students, juries)
 */
adminRouter.get("/", Authenticate(["ADMIN"]), async (req, res) => {
    const rows = await prisma.user.findMany();
    res.status(200).json(rows);
    if(rows == null) 
    {
        error_obj = {err : 404};
        return res.status(404);
    }

});

adminRouter.get("/group/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const group = await prisma.group.findFirst(
        {
            where:
            {
                id: parseInt(req.params.id)
            }
        });
    if(group == null) {
        error_obj = {err : 404}
        return res.status(404)
    }
    res.status(200).json(group);
})
adminRouter.get("/groups", Authenticate(["ADMIN"]), async (req, res) => {
    const groups = await prisma.group.findMany();
    if(groups == null) 
    {
       error_obj = {err: 404};
        return res.status(404).send("Error");
    }
    res.json(groups)
})
adminRouter.delete("/groups/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const users = prisma.user.updateMany({
        where: {
            groupId: parseInt(req.params.id)
        },
        data: {
            groupId: null
        }
    })
    const group = await prisma.group.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (group == null) {
        res.status(404).send("Requested group not found.");
    }
    res.status(200).json(group);
})
adminRouter.put("/groups/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.group.update(
        {
            where:
            {
                id: parseInt(req.params.id)
            },
            data:
            {
                name: req.body.name,
                description: req.body.description
            }
        });
    res.status(200).json(user);
})
adminRouter.post("/groups/", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.group.create(
        {
            data:
            {
                name: req.body.name,
                description: req.body.description,
                competitionId: null
            }
        });
    res.status(200).json(user);
})
adminRouter.put("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    let user
    if (req.body.password) {
        user = await prisma.user.update(
            {
                where:
                {
                    id: parseInt(req.params.id)
                },
                data:
                {
                    username: req.body.username,
                    password: HashPassword(req.body.password),
                    role: req.body.role,
                    grade: parseInt(req.body.grade),
                    class: req.body.class,
                    groupId: parseInt(req.body.groupId)
                }
            });
    } else {
        user = await prisma.user.update(
            {
                where:
                {
                    id: parseInt(req.params.id)
                },
                data:
                {
                    username: req.body.username,
                    role: req.body.role,
                    grade: parseInt(req.body.grade),
                    class: req.body.class,
                    groupId: parseInt(req.body.groupId)
                }
            });
    }
    if(!user) 
    {
        error_obj = {err: 500};
        return res.status(500).send("Internal server error");

    }
    res.status(200).json(user);
})

adminRouter.post("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = prisma.user.update(
        {
            where:
            {
                id: parseInt(req.params.id)
            },
            data:
            {
                //TODO: rewrite manually
            }
        });
    if(!user) 
    {
        error_obj = {err: 500};
        return res.status(500).send("Internal server error");
    }
    res.status(200).json(user);
})


adminRouter.delete("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.user.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (user == null) {
        error_obj = { err: 404}
        return res.status(404).send("Requested user not found.");
    }
    res.status(200).json(user);
})
