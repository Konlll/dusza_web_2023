import express from "express";
import prisma from "../db.js";
import { Authenticate, HashPassword } from "../authentication.js";
export const adminRouter = express.Router();


/**
 * Gets all users (teachers, students, juries)
 */
adminRouter.get("/", Authenticate(["ADMIN"]), async (req, res) => {
    const rows = await prisma.user.findMany();
    res.status(200).json(rows);
    if(rows == null) 
    {
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
        return res.status(404)
    }
    res.status(200).json(group);
})
adminRouter.get("/groups", Authenticate(["ADMIN"]), async (req, res) => {
    const groups = await prisma.group.findMany();
    if(groups == null) 
    {
        return res.status(404).send("Error");
    }
    res.json(groups)
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
        return res.status(500).send("Internal server error");
    }
    res.status(200).json(user);
})


adminRouter.delete("/:id", Authenticate(["ADMIN"]),async (req,res) => 
    {
        const user = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
    if (user == null) {
        return res.status(404).send("Requested user not found.");
    }
    res.status(200).json(user);
})
