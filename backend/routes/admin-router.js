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

});

adminRouter.get("/group/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const group = await prisma.group.findFirst(
        {
            where:
            {
                id: parseInt(parseIntreq.params.id)
            }
        });
    res.status(200).json(group);
})
adminRouter.get("/groups", Authenticate(["ADMIN"]), async (req, res) => {
    const groups = await prisma.group.findMany();
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
                ...req.body
            }
        });
    res.status(200).send(`Successfully created user with ID:  ${req.params.id}`).json(user);
})


adminRouter.delete("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.user.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (user == null) {
        res.status(404).send("Requested user not found.");
    }
    res.status(200).json(user);
})